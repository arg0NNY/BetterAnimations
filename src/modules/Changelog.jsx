import { UI } from '@/BdApi'
import meta from '@/meta'
import IconBrand from '@/components/icons/IconBrand'
import { Button, ModalActions, Text, Tooltip } from '@discord/modules'
import { css } from '@style'
import SocialLinks from '@/components/SocialLinks'
import ArrowSmallRightIcon from '@/components/icons/ArrowSmallRightIcon'
import PackModal from '@/settings/components/pack/PackModal'
import { PackContentLocation, PackMeta } from '@/settings/components/pack/PackContent'
import Settings from '@/settings'
import Logger from '@logger'
import PackRegistry from '@/modules/PackRegistry'
import changelog from '@changelog'
import Data from '@/modules/Data'
import { version } from '@package'
import regex from '@utils/regex'
import Config from '@/modules/Config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'

function parseVersion (version) {
  const data = version.match(regex.semver)
  if (!data) return null

  const [, major, minor, patch, id] = data
  return { major, minor, patch, id }
}

class Changelog {
  get name () { return 'Changelog' }

  constructor () {
    this.onPackLoaded = pack => this.showPackModalIfNeeded(pack)
  }

  get data () { return Data.currentVersionInfo }
  set data (value) { Data.currentVersionInfo = value }

  initialize () {
    this.showPluginModalIfNeeded()
    Emitter.on(Events.PackLoaded, this.onPackLoaded)

    Logger.log(this.name, 'Initialized.')
  }

  shutdown () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)

    Logger.log(this.name, 'Shutdown.')
  }

  showModal ({ title, version, subtitle, footer, ...props }) {
    return UI.showChangelogModal({
      ...props,
      title: (
        <div className="BA__changelogModalHeader">
          <Tooltip
            text={meta.name}
            shouldShow={!!title}
            position="bottom"
            align="left"
          >
            {props => (
              <IconBrand
                {...props}
                size="custom"
                width={36}
                height={36}
              />
            )}
          </Tooltip>
          <div className="BA__changelogModalHeaderInfo">
            <span>{title ?? meta.name} </span>
            {version && (
              <Text
                tag="span"
                variant="text-sm/semibold"
                color="text-muted"
              >
                v{version}
              </Text>
            )}
          </div>
        </div>
      ),
      footer: footer && (
        <div className="BA__changelogModalFooter">
          {footer}
        </div>
      )
    })
  }

  showPluginModal (version, props = changelog[version]) {
    if (!props) return

    return this.showModal({
      ...props,
      version,
      footer: (
        <>
          <SocialLinks />
          <Button
            size="sm"
            icon={ArrowSmallRightIcon}
            iconPosition="end"
            text="Go to Settings"
            onClick={() => {
              ModalActions.closeAllModals()
              Settings.openSettingsModal()
            }}
          />
        </>
      )
    })
  }
  showPluginMajorModalIfNeeded () {
    const [a, b] = [this.data.version, version].map(parseVersion)
    if (a && b && a.major !== b.major && [b.minor, b.patch].some(i => i !== '0')) this.showPluginModal(`${b.major}.0.0`)
  }
  showPluginModalIfNeeded () {
    if (this.data.version === version && this.data.hasShownChangelog) return

    this.showPluginModal(version)
    this.showPluginMajorModalIfNeeded()

    this.data = { version, hasShownChangelog: true }
  }

  showPackModal (pack) {
    if (!pack.changelog) return

    const showPackModal = () => ModalActions.openModal(props => (
      <PackModal
        {...props}
        filename={pack.filename}
        location={PackContentLocation.LIBRARY}
      />
    ))

    try {
      return this.showModal({
        banner: PackRegistry.getThumbnailSrc(pack),
        ...pack.changelog,
        title: pack.name,
        version: pack.version,
        footer: (
          <>
            <PackMeta pack={pack} />
            <Button
              size="sm"
              icon={ArrowSmallRightIcon}
              iconPosition="end"
              text="View"
              onClick={showPackModal}
            />
          </>
        )
      })
    }
    catch (error) {
      Logger.error(this.name, `Failed to show changelog modal for pack ${pack.name}:`, error)
    }
  }
  showPackModalIfNeeded (pack) {
    if (pack.partial) return

    const config = Config.pack(pack.slug)
    const currentVersion = config.loadData('currentVersion')
    if (currentVersion === pack.version) return

    if (currentVersion) this.showPackModal(pack)
    config.saveData('currentVersion', pack.version)
  }
}

export default new Changelog

css
`.BA__changelogModalHeader {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__changelogModalFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}`
`Changelog`
