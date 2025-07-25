import {
  Button,
  colors,
  GuildIcon,
  GuildStore,
  handleClick,
  InviteActions,
  InviteStates,
  InviteStore,
  LayerActions,
  ModalActions,
  Text,
  TextBadge,
  Tooltip,
  useStateFromStores
} from '@discord/modules'
import IconButton from '@/settings/components/IconButton'
import { css } from '@style'
import classNames from 'classnames'
import DownloadIcon from '@/settings/components/icons/DownloadIcon'
import TrashIcon from '@/settings/components/icons/TrashIcon'
import CheckIcon from '@/settings/components/icons/CheckIcon'
import CircleQuestionIcon from '@/settings/components/icons/CircleQuestionIcon'
import Divider from '@/components/Divider'
import CircleDollarSignIcon from '@/settings/components/icons/CircleDollarSignIcon'
import SquircleMask from '@/settings/components/SquircleMask'
import LinkIcon from '@/settings/components/icons/LinkIcon'
import DiscordClasses from '@discord/classes'
import ArrowSmallRightIcon from '@/settings/components/icons/ArrowSmallRightIcon'
import { useCallback, useEffect } from 'react'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'
import usePackRegistry from '@/hooks/usePackRegistry'
import { stop } from '@/settings/utils/eventModifiers'
import ErrorManager from '@error/manager'
import JSONIcon from '@/settings/components/icons/JSONIcon'
import PackManager from '@/modules/PackManager'
import { path } from '@/modules/Node'
import Modal from '@/components/Modal'
import Skeleton from '@/settings/components/Skeleton'
import { isInviteInvalid } from '@discord/utils'
import { UI } from '@/BdApi'
import Core from '@/modules/Core'
import PackHeader from '@/settings/components/PackHeader'

export const PackContentLocation  = {
  CATALOG: 0,
  LIBRARY: 1
}

function PackVersion ({ version, from }) {
  return (
    <span className="BA__packVersion">
      {from && (
        <>
          <span>{from}</span>
          <ArrowSmallRightIcon size="xs" color="currentColor" />
        </>
      )}
      <span>{version}</span>
    </span>
  )
}

function PackField ({ icon, title, titleColor, subtitle, children }) {
  return (
    <div className="BA__packField">
      <div className="BA__packFieldInfo">
        {icon}
        <div className="BA__packFieldInfoContent">
          <Text
            className="BA__packFieldTitle"
            variant="text-md/semibold"
            lineClamp={1}
            color={titleColor}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="BA__packFieldSubtitle"
              variant="text-sm/normal"
              color="text-muted"
            >
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      {children && (
        <div className="BA__packFieldActions">
          {children}
        </div>
      )}
    </div>
  )
}

function PackAction ({ pack, size, location }) {
  const registry = usePackRegistry()

  const isInstalled = !!pack.installed
  const hasUpdate = isInstalled && registry.hasUpdate(pack.installed)

  const pending = registry.isPending(pack.filename)

  const props = {
    size,
    fullWidth: size === 'md',
    loading: pending,
    disabled: pending
  }

  if (hasUpdate) return (
    <Button
      {...props}
      icon={DownloadIcon}
      text={(
        <>
          <span>Update</span>
          {size === 'md' && (
            <PackVersion
              from={pack.installed.version}
              version={registry.getPack(pack.filename).version}
            />
          )}
        </>
      )}
      onClick={stop(() => registry.update(pack.filename))}
    />
  )

  if (isInstalled) {
    if (location === PackContentLocation.LIBRARY && size === 'sm') return null

    return (
      <Button
        {...props}
        icon={CheckIcon}
        variant="active"
        disabled
        text={(
          <>
            <span>
              {
                location === PackContentLocation.LIBRARY && registry.hasPack(pack.filename)
                  ? 'Up to date'
                  : 'Installed'
              }
            </span>
            {size === 'md' && (
              <PackVersion version={pack.version} />
            )}
          </>
        )}
      />
    )
  }

  return (
    <Button
      {...props}
      icon={DownloadIcon}
      text={(
        <>
          <span>Install</span>
          {size === 'md' && (
            <PackVersion version={pack.version} />
          )}
        </>
      )}
      onClick={stop(() => registry.install(pack.filename))}
    />
  )
}

function PackInvite ({ code }) {
  const invite = useStateFromStores([InviteStore], () => InviteStore.getInvite(code))
  const guild = useStateFromStores([GuildStore], () => GuildStore.getGuild(invite?.guild?.id), [invite])

  useEffect(() => {
    if (!invite) InviteActions.resolveInvite(code)
  }, [code, invite])

  const pending = !invite || invite.state === InviteStates.RESOLVING
  const invalid = isInviteInvalid(invite)

  const join = useCallback(() => {
    if (guild) {
      ModalActions.closeAllModals()
      LayerActions.popAllLayers()
    }
    UI.showInviteModal(code)
  }, [code, guild])

  return (
    <PackField
      icon={(
        <SquircleMask size={48}>
          {pending || invalid || !invite?.guild ? (
            <Skeleton
              width={48}
              height={48}
              rounded={false}
              animated={pending}
            />
          ) : (
            <GuildIcon
              className="BA__packServerIcon"
              guild={invite.guild}
              active={true}
            />
          )}
        </SquircleMask>
      )}
      title={(
        pending
          ? <Skeleton width={130} />
          : invalid
            ? 'Invalid Invite'
            : invite?.guild?.name
      )}
      titleColor={invalid ? 'text-danger' : undefined}
      subtitle="Support Server"
    >
      <Button
        variant="secondary"
        size="sm"
        text={guild ? 'Open' : 'Join'}
        loading={pending}
        disabled={pending || invalid}
        onClick={join}
      />
    </PackField>
  )
}

function PackContent ({ pack, className, size = 'sm', location = PackContentLocation.CATALOG }) {
  const registry = usePackRegistry()

  const isPublished = registry.hasPack(pack.filename)
  const authorAvatarSrc = registry.getAuthorAvatarSrc(pack)

  const showSource = useCallback(() => {
    if (location === PackContentLocation.CATALOG) handleClick({ href: registry.getSourceURL(pack.filename) })
    else DiscordNative.fileManager.showItemInFolder(
      path.resolve(PackManager.addonFolder, pack.filename)
    )
  }, [pack, location])

  const uninstall = useCallback(() => {
    if (!pack.installed) return

    const affectedModules = Core.getModulesUsingPack(pack)

    ModalActions.openModal(props => (
      <Modal
        {...props}
        title="Uninstall Pack"
        confirmText={isPublished ? 'Uninstall' : 'Delete permanently'}
        confirmButtonVariant="critical-primary"
        cancelText="Cancel"
        onConfirm={() => registry.delete(pack.filename)}
      >
        <Text variant="text-md/normal">
          Are you sure you want to delete pack <b>{pack.name}</b>?
          {isPublished ? (
            ' It can always be reinstalled from the Catalog.'
          ) : (
            ' It is not published in the Catalog, so it cannot be reinstalled.'
          )}
        </Text>
        {affectedModules.length > 0 && (
          <Text variant="text-md/normal" className={DiscordClasses.Margins.marginTop8}>
            {'Animations of this pack are currently applied for: '}
            {affectedModules.map((module, i, { length }) => (
              <>
                <b>{module.name}</b>
                {i < length - 1 ? ', ' : '.'}
              </>
            ))}
            {' They will be automatically deselected.'}
          </Text>
        )}
      </Modal>
    ))
  }, [pack])

  return (
    <div
      className={classNames(
        'BA__packContent',
        `BA__packContent--${size}`,
        className
      )}
    >
      {pack.installed && registry.hasUpdate(pack.installed) && (
        <TextBadge
          className="BA__packBadge"
          text="Update available"
          color="var(--bg-brand)"
        />
      )}
      <div className="BA__packSplash">
        <img
          className="BA__packSplashImage"
          src={registry.getThumbnailSrc(pack)}
          alt={pack.name}
          loading="lazy"
          draggable="false"
        />
        {size === 'sm' && (
          <Tooltip text={pack.author}>
            {props => (
              <div
                {...props}
                className="BA__packSplashAuthor"
              >
                <img
                  className="BA__packAuthorAvatar"
                  src={authorAvatarSrc}
                  alt={pack.author}
                />
              </div>
            )}
          </Tooltip>
        )}
      </div>
      <div className="BA__packContentContainer">
        <PackHeader
          pack={pack}
          size={size}
        />
        {pack.description && (
          <Text
            className={classNames('BA__packDescription', DiscordClasses.Scroller.thin)}
            variant="text-sm/medium"
            color="text-muted"
            lineClamp={size === 'sm' && 2}
          >
            {pack.description}
          </Text>
        )}
        <div className="BA__packContentSpacer" />
        <div className="BA__packFooter">
          {size === 'md' ? (
            <>
              <div>
                <PackField
                  icon={(
                    <img
                      className="BA__packAuthorAvatar"
                      src={authorAvatarSrc}
                      alt={pack.author}
                    />
                  )}
                  title={pack.author}
                  subtitle="Author"
                >
                  {pack.authorLink && (
                    <Tooltip text="Author's Page">
                      {props => (
                        <Button
                          {...props}
                          variant="secondary"
                          size="sm"
                          icon={LinkIcon}
                          onClick={() => handleClick({ href: pack.authorLink })}
                        />
                      )}
                    </Tooltip>
                  )}
                  {pack.donate && (
                    <Tooltip text="Donate">
                      {props => (
                        <Button
                          {...props}
                          variant="active"
                          size="sm"
                          icon={CircleDollarSignIcon}
                          onClick={() => handleClick({ href: pack.donate })}
                        />
                      )}
                    </Tooltip>
                  )}
                </PackField>
                {pack.invite && (
                  <PackInvite code={pack.invite} />
                )}
              </div>
              <Divider />
              <Button
                variant="icon-only"
                icon={JSONIcon}
                text={pack.filename}
                fullWidth
                onClick={showSource}
              />
            </>
          ) : (
            <div className="BA__packMeta">
              <IconButton
                tooltip="Source"
                onClick={stop(showSource)}
              >
                <JSONIcon size="sm" color="currentColor" />
              </IconButton>
              {pack.invite && (
                <IconButton
                  tooltip="Support Server"
                  onClick={stop(() => UI.showInviteModal(pack.invite))}
                >
                  <CircleQuestionIcon size="sm" color="currentColor" />
                </IconButton>
              )}
            </div>
          )}
          <div class="BA__packActions">
            {pack.partial && (
              <IconButton
                tooltip="An error occurred"
                onClick={stop(() => ErrorManager.showModal([pack.error]))}
              >
                <CircleWarningIcon
                  size="md"
                  color={colors.STATUS_DANGER}
                  secondaryColor="var(--white-400)"
                />
              </IconButton>
            )}
            <PackAction
              pack={pack}
              size={size}
              location={location}
            />
            {pack.installed && (
              <Tooltip text="Uninstall">
                {props => (
                  <Button
                    {...props}
                    variant="critical-primary"
                    size={size}
                    icon={TrashIcon}
                    disabled={registry.isPending(pack.filename)}
                    onClick={stop(uninstall)}
                  />
                )}
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

PackContent.Location = PackContentLocation

export default PackContent

css
`.BA__packContent {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 0;
}
.BA__packBadge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
}
.BA__packSplash {
    background: linear-gradient(180deg, rgba(15, 16, 17, 0), rgba(15, 16, 17, .4));
    aspect-ratio: 16 / 9;
    position: relative;
}
.BA__packSplashImage {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.BA__packSplashAuthor {
    position: absolute;
    right: 20px;
    bottom: -16px;
    z-index: 2;
    border-radius: 50%;
    box-shadow: 0 0 0 5px currentColor;
}
.BA__packContentContainer {
    display: flex;
    flex-direction: column;
    padding: 16px;
    flex: 1;
    min-height: 0;
}
.BA__packContent .BA__packHeader {
    margin-bottom: 6px;
}
.BA__packDescription {
    word-break: break-word;
}
.BA__packContentSpacer {
    flex: 1;
}
.BA__packFooter {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}
.BA__packMeta {
    display: flex;
    align-items: center;
    gap: 8px;
}
.BA__packActions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.BA__packField {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
}
.BA__packFieldInfo {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
}
.BA__packFieldInfo > * {
    flex-shrink: 0;
}
.BA__packFieldInfoContent {
    min-width: 0;
    flex: 1;
}
.BA__packFieldActions {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__packAuthorAvatar,
.BA__packServerIcon {
    display: block;
    width: 48px;
    height: 48px;
    object-fit: cover;
    background-color: var(--background-base-low);
    border-radius: 0;
}
.BA__packAuthorAvatar {
    border-radius: 50%;
}
.BA__packVersion {
    opacity: .8;
    padding: 0 4px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-weight: 400;
}

.BA__packContent--sm .BA__packHeader {
    padding-right: 56px;
}
.BA__packContent--md .BA__packFooter {
    flex-direction: column;
    align-items: stretch;
}
.BA__packContent--md .BA__packDescription {
    overflow: hidden auto;
}`
`PackContent`
