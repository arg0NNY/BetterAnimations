import { CONFIG_VERSION } from '@data/config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Logger from '@logger'
import Toasts from '@/modules/Toasts'
import ErrorManager from '@error/manager'
import InternalError from '@error/structs/InternalError'
import { ModalActions, Text } from '@discord/modules'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import { MigratorModal } from '@/components/Migrator'
import Modal from '@/components/Modal'
import Messages from '@shared/messages'

const AbortSymbol = Symbol('Abort')

class Migrator {
  static IDLE = 0
  static BUSY = 1
  static ERROR = 2

  get name () { return 'Migrator' }

  constructor (config, migrations = {}) {
    this.config = config
    this.migrations = migrations

    this._status = Migrator.IDLE
    this._abortController = null
    this._schedulerCallbackId = null

    this.error = null
  }

  get status () {
    return this._status
  }
  set status (value) {
    this._status = value
    if (value !== Migrator.ERROR) this.error = null
    Emitter.emit(Events.MigratorUpdated)
  }

  get configs () {
    return this.config.getAll()
  }
  getOutdatedConfigs (configs = this.configs) {
    return configs.filter(config => config.isOutdated)
  }
  hasOutdatedConfigs (configs = this.configs) {
    return configs.some(config => config.isOutdated)
  }
  get isActive () {
    return this.hasOutdatedConfigs()
  }

  getMinVersion (configs, latestVersion = CONFIG_VERSION) {
    return configs.reduce((minVersion, config) => Math.min(minVersion, config.configVersion), latestVersion)
  }

  buildPromptMessage (configs = this.getOutdatedConfigs()) {
    return this.config.buildMigrationPromptMessage(configs)
  }

  useEffect () {
    useEmitterEffect(Events.MigratorUpdated)
  }
  useMessage () {
    this.useEffect()

    switch (this.status) {
      case Migrator.IDLE: {
        if (!this.hasOutdatedConfigs()) return (
          <p>Your settings are up to date.</p>
        )
        return this.buildPromptMessage()
      }
      case Migrator.BUSY: return (
        <p>Your settings are being migrated to the latest version...</p>
      )
      case Migrator.ERROR: return (
        <>
          <p>An error occurred while trying to migrate your settings to the latest version.</p>
          <p>Contact the support if you don't want to lose your settings.</p>
        </>
      )
    }
  }
  useActions () {
    this.useEffect()

    switch (this.status) {
      case Migrator.IDLE: {
        if (!this.hasOutdatedConfigs()) return []
        return [
          {
            text: 'Migrate',
            onClick: () => this.migrate(true)
          },
          {
            variant: 'secondary',
            text: 'Cancel',
            onClick: () => this.promptCancel()
          }
        ]
      }
      case Migrator.BUSY: return [
        {
          text: 'Migrate',
          disabled: true,
          loading: true
        },
        {
          variant: 'secondary',
          text: 'Abort',
          onClick: () => this.abort()
        }
      ]
      case Migrator.ERROR: return [
        {
          text: 'View',
          onClick: () => ErrorManager.showModal([this.error])
        },
        {
          variant: 'secondary',
          text: 'Try again',
          onClick: () => this.migrate(true)
        },
        {
          variant: 'secondary',
          text: 'Cancel',
          onClick: () => this.promptCancel()
        }
      ]
    }
  }
  use () {
    this.useEffect()

    return {
      isActive: this.isActive,
      status: this.status,
      loading: this.status === Migrator.BUSY,
      error: this.error,
      message: this.useMessage(),
      actions: this.useActions()
    }
  }

  prompt () {
    ModalActions.openModal(props => (
      <MigratorModal
        {...props}
        migrator={this}
      />
    ), { modalKey: 'BA__migratorModal' })
  }
  promptIfNeeded (versionOrConfigs = this.configs) {
    if (Array.isArray(versionOrConfigs)) return this.promptIfNeeded(this.getMinVersion(versionOrConfigs))

    for (let v = versionOrConfigs + 1; v <= CONFIG_VERSION; v++) {
      if (!this.migrations[v].prompt) continue

      this.prompt()
      return true
    }
    return false
  }

  applyMutations (mutations) {
    const incompleteMutations = mutations.filter(mutation => mutation.version !== CONFIG_VERSION)
    if (incompleteMutations.length) {
      Logger.error(this.name, 'Found incomplete mutations after migration:', incompleteMutations)
      throw new Error('Found incomplete mutations')
    }

    this.config.applyMutations(mutations)
  }

  async migrate (confirmed = false) {
    if (this.status === Migrator.BUSY || !this.hasOutdatedConfigs()) return

    const version = this.getMinVersion(this.configs)
    if (!confirmed && this.promptIfNeeded(version)) return

    this.status = Migrator.BUSY
    this._abortController = new AbortController()
    const signal = this._abortController.signal

    try {
      const configs = this.configs.map(config => ({
        slug: config.slug,
        version: config.configVersion,
        data: config.data.settings
      }))
      const mutations = []

      for (let v = version + 1; v <= CONFIG_VERSION; v++) {
        const migration = this.migrations[v]
        if (!migration) throw new Error(`Migration for version ${v} doesn't exist`)

        const result = await migration.handler(
          mutations.concat(configs)
            .filter(config => config.version === v - 1)
            .map(config => structuredClone(config)),
          signal
        )
        if (result === false || signal.aborted) throw AbortSymbol

        for (const mutation of result) {
          const existing = mutations.find(m => m.slug === mutation.slug)
          if (existing) Object.assign(existing, mutation)
          else mutations.push(mutation)
        }
      }

      this.applyMutations(mutations)

      if (confirmed) Toasts.success('Settings successfully migrated.')
      this.status = Migrator.IDLE
    }
    catch (error) {
      if (error === AbortSymbol) {
        Logger.warn(this.name, 'Migration aborted.')
        this.status = Migrator.IDLE
        return
      }

      Logger.error(this.name, 'Migration failed:', error)
      error = new InternalError(`${this.name}: ${error.stack ?? error.message}`)
      this.prompt()
      this.error = error
      this.status = Migrator.ERROR
    }
  }

  schedule () {
    cancelIdleCallback(this._schedulerCallbackId)
    this._schedulerCallbackId = requestIdleCallback(() => this.migrate())
  }

  validate (configs = this.configs) {
    if (!this.hasOutdatedConfigs(configs)) return

    if (!this.promptIfNeeded(configs)) this.schedule()
    Emitter.emit(Events.MigratorUpdated)
  }

  abort () {
    this._abortController?.abort(AbortSymbol)
  }

  cancel () {
    for (const config of this.configs) {
      if (config.isOutdated) config.reset()
    }
  }
  promptCancel () {
    ModalActions.openModal(props => (
      <Modal
        {...props}
        title={Messages.SETTINGS_MIGRATOR}
        confirmText="Confirm cancellation"
        confirmButtonVariant="critical-primary"
        cancelText="Back to migration"
        onConfirm={() => this.cancel()}
      >
        <Text variant="text-md/normal">
          <p>
            Are you sure you want to cancel migration? Your configuration will be deleted <b>permanently</b>.
          </p>
          <p>
            This means that you will lose all your settings from the previous version and it will be replaced with the default settings. <b>This action cannot be undone.</b>
          </p>
        </Text>
      </Modal>
    ))
  }
}

export default Migrator
