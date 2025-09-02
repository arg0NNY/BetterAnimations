import {
  Button,
  humanize,
  ModalRoot,
  ModalSize,
  SingleSelect,
  Spinner,
  Text,
  Timestamp,
  Tooltip
} from '@discord/modules'
import { css } from '@style'
import PackContent, { PackContentLocation } from '@/settings/components/pack/PackContent'
import { ErrorBoundary } from '@error/boundary'
import usePackRegistry from '@/hooks/usePackRegistry'
import PackManager from '@/modules/PackManager'
import { useCallback, useEffect, useRef, useState } from 'react'
import Core from '@/modules/Core'
import AnimationPreview from '@/settings/components/animation/AnimationPreview'
import XIcon from '@/components/icons/XIcon'
import ChevronSmallLeftIcon from '@/components/icons/ChevronSmallLeftIcon'
import ChevronSmallRightIcon from '@/components/icons/ChevronSmallRightIcon'
import ErrorCard from '@/error/components/ErrorCard'
import { IconBrandTypes } from '@/components/icons/IconBrand'
import useEventListener from '@/hooks/useEventListener'
import Data from '@/modules/Data'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@enums/Events'

function ModuleLabel ({ module }) {
  const parent = Core.getParentModule(module)
  return (
    <div className="BA__moduleLabel">
      {parent && (
        <>
          {parent.name}
          <ChevronSmallRightIcon
            size="xs"
            color="currentColor"
          />
        </>
      )}
      {module.name}
    </div>
  )
}

function PackPreview ({ pack, module }) {
  const animations = pack.animations.filter(a => module?.isSupportedBy(a))

  const [index, setIndex] = useState(0)
  const step = step => setIndex(index => (animations.length + index + step) % animations.length)

  useEventListener('keydown', e => {
    if (e.repeat) return
    switch (e.code) {
      case 'ArrowLeft': return step(-1)
      case 'ArrowRight': return step(1)
    }
  })

  const animation = animations[index]

  useEffect(() => {
    if (index >= animations.length) setIndex(0)
  })

  return (
    <div className="BA__packPreview">
      <div className="BA__packPreviewContent">
        <AnimationPreview
          key={animation?.key}
          className="BA__packPreviewAnimation"
          module={module}
          pack={pack}
          animation={animation}
          title={null}
          active={animation != null}
        />
      </div>
      <div className="BA__packPreviewFooter">
        {animations.length > 1 && (
          <Button
            variant="icon-only"
            icon={ChevronSmallLeftIcon}
            onClick={() => step(-1)}
          />
        )}
        {animation && (
          <Text
            className="BA__packPreviewTitle"
            variant="heading-lg/semibold"
            lineClamp={1}
          >
            {animation.name}
          </Text>
        )}
        {animations.length > 1 && (
          <Button
            variant="icon-only"
            icon={ChevronSmallRightIcon}
            onClick={() => step(1)}
          />
        )}
      </div>
    </div>
  )
}

function usePack ({ filename, location, onClose }) {
  const registry = usePackRegistry()

  const cachedPack = useRef()
  const storedPack = location === PackContentLocation.CATALOG
    ? registry.getPack(filename)
    : PackManager.getPackByFile(filename, true)
  useEffect(() => {
    if (!storedPack) onClose()
    else cachedPack.current = storedPack
  }, [!storedPack])

  return storedPack ?? cachedPack.current
}

function useLoadedPack (pack, isRemote) {
  const registry = usePackRegistry()
  const remoteData = registry.storage.use(isRemote ? pack?.filename : null)
  return isRemote ? remoteData : { pack, loading: false, error: null }
}

function PackMeta ({ pack }) {
  const meta = []

  if (pack.createdAt) meta.push(
    <Timestamp
      timestamp={pack.createdAt}
      timestampFormat="[Published] L"
    />
  )
  if (pack.updatedAt) meta.push(
    <Timestamp
      timestamp={pack.updatedAt}
      timestampFormat="[Updated] L"
    />
  )

  const size = pack.size ?? pack.installed?.size
  if (size) meta.push(
    humanize.filesize(size)
  )

  if (pack.installed) {
    const modules = Core.getModulesUsingPack(pack.installed)
    meta.push(
      <Tooltip
        text={modules.map(m => m.name).join(', ')}
        shouldShow={modules.length > 0}
      >
        {props => (
          <span {...props}>
            {modules.length > 0 ? (
              `Used in ${modules.length} ${modules.length > 1 ? 'modules' : 'module'}`
            ) : (
              'Not used in any modules'
            )}
          </span>
        )}
      </Tooltip>
    )
  }

  return (
    <Text
      className="BA__packModalMeta"
      variant="text-sm/medium"
      color="text-muted"
    >
      {meta.map((item, index) => (
        <>
          {item}
          {index < meta.length - 1 && ' • '}
        </>
      ))}
    </Text>
  )
}

function PackModal ({ filename, location = PackContentLocation.CATALOG, onClose, ...props }) {
  useEmitterEffect(Events.PluginDisabled, onClose)

  const registry = usePackRegistry()

  const pack = usePack({ filename, location, onClose })
  const { pack: loadedPack, loading, error } = useLoadedPack(pack, location === PackContentLocation.CATALOG)

  const modules = Core.getAllModules(true)
    .filter(module => !loadedPack || loadedPack.partial || loadedPack.animations?.some(a => module.isSupportedBy(a)))

  const [moduleId, setModuleId] = useState(Data.preferences.module ?? modules[0]?.id)
  const moduleIndex = modules.findIndex(m => m.id === moduleId)
  const module = modules[moduleIndex]

  const selectModule = useCallback(moduleId => {
    setModuleId(moduleId)
    Data.preferences.module = moduleId
  }, [setModuleId])
  const step = step => {
    const module = modules.at((moduleIndex + step) % modules.length)
    if (module) selectModule(module.id)
  }

  const options = modules.map(module => ({ module, value: module.id, label: module.name }))

  useEffect(() => {
    if (!modules.some(m => m.id === moduleId)) setModuleId(modules[0]?.id)
  })

  useEventListener('keydown', e => {
    if (e.repeat) return
    switch (e.code) {
      case 'ArrowUp': return step(-1)
      case 'ArrowDown': return step(1)
    }
  })

  const errorCard = (() => {
    if (pack?.partial) return { text: 'Pack did not load properly. Preview is unavailable.' }
    if (error || !loadedPack) return { text: 'Failed to load the preview.' }
    if (!registry.verifier.check(pack)) return { iconType: IconBrandTypes.WARNING, text: 'Preview is not available for unverified packs.' }
    if (!modules.length) return { iconType: IconBrandTypes.WARNING, text: 'This pack does not support any animation modules.' }
    if (!module) return { iconType: IconBrandTypes.WARNING, text: 'Module not found.' }
    return null
  })()

  return (
    <ModalRoot
      {...props}
      className="BA__packModal"
      size={ModalSize.DYNAMIC}
      onClose={onClose}
    >
      <ErrorBoundary>
        {pack && (
          <>
            <div className="BA__packModalSidebar">
              <PackContent
                className="BA__packModalContent"
                pack={pack}
                location={location}
                size="md"
              />
            </div>
            <div className="BA__packModalPreview">
              <div className="BA__packModalPreviewHeader">
                <SingleSelect
                  className="BA__packModalPreviewSelect"
                  options={options}
                  value={moduleId}
                  onChange={selectModule}
                  isDisabled={loading || errorCard}
                  renderOptionLabel={({ module }) => <ModuleLabel module={module} />}
                  renderOptionValue={([option]) => option && <ModuleLabel module={option.module} />}
                />
                <Button
                  variant="icon-only"
                  icon={XIcon}
                  onClick={onClose}
                />
              </div>
              <div className="BA__packModalPreviewContent">
                {loading ? (
                  <Spinner className="BA__packModalPreviewSpinner" />
                ) : errorCard ? (
                  <ErrorCard
                    className="BA__packModalPreviewError"
                    {...errorCard}
                  />
                ) : (
                  <PackPreview
                    key={moduleId}
                    module={module}
                    pack={loadedPack}
                  />
                )}
              </div>
              <div className="BA__packModalPreviewFooter">
                <PackMeta pack={pack} />
              </div>
            </div>
          </>
        )}
      </ErrorBoundary>
    </ModalRoot>
  )
}

export default PackModal

css
`.BA__packModal {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    height: 600px;
    overflow: clip;
    max-width: 100%;
}
.BA__packModalSidebar {
    width: 350px;
    display: flex;
    flex-direction: column;
    background-color: var(--background-base-lowest);
}
.BA__packModalContent {
    flex: 1;
}

.BA__packModalPreview {
    width: 560px;
    flex-grow: 1;
    border-left: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    padding: 16px;
}
.BA__packModalPreviewHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}
.BA__packModalPreviewSelect {
    min-width: 260px;
}
.BA__packModalPreviewContent {
    flex: 1;
}
.BA__packModalPreviewFooter {
    text-align: center;
}
.BA__packModalPreviewError,
.BA__packModalPreviewSpinner {
    aspect-ratio: 16 / 9;
}
.BA__packModalMeta > * {
    margin: 0 !important;
}

.BA__packPreviewContent {
    display: flex;
    align-items: center;
    gap: 8px;
}
.BA__packPreviewAnimation {
    flex: 1;
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--border-subtle);
}
.BA__packPreviewFooter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    text-align: center;
}
.BA__packPreviewTitle {
    flex: 1;
}

.BA__moduleLabel {
    display: flex;
    align-items: center;
    gap: 2px;
}`
`PackModal`
