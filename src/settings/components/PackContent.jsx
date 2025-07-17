import { Button, colors, handleClick, Text, TextBadge, Tooltip } from '@discord/modules'
import IconButton from '@/settings/components/IconButton'
import { css } from '@style'
import classNames from 'classnames'
import DownloadIcon from '@/settings/components/icons/DownloadIcon'
import TrashIcon from '@/settings/components/icons/TrashIcon'
import CheckIcon from '@/settings/components/icons/CheckIcon'
import GitHubIcon from '@/settings/components/icons/GitHubIcon'
import CircleQuestionIcon from '@/settings/components/icons/CircleQuestionIcon'
import Divider from '@/components/Divider'
import CircleDollarSignIcon from '@/settings/components/icons/CircleDollarSignIcon'
import SquircleMask from '@/settings/components/SquircleMask'
import ExternalLinkIcon from '@/settings/components/icons/ExternalLinkIcon'
import LinkIcon from '@/settings/components/icons/LinkIcon'
import DiscordClasses from '@discord/classes'
import ArrowSmallRightIcon from '@/settings/components/icons/ArrowSmallRightIcon'
import VerifiedCheckIcon from '@/settings/components/icons/VerifiedCheckIcon'
import { useCallback, useMemo } from 'react'
import DangerIcon from '@/settings/components/icons/DangerIcon'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'
import { PackVerificationStatus } from '@/modules/PackRegistry'
import usePackRegistry from '@/hooks/usePackRegistry'
import { stop } from '@/settings/utils/eventModifiers'
import ErrorManager from '@error/manager'
import JSONIcon from '@/settings/components/icons/JSONIcon'
import PackManager from '@/modules/PackManager'
import { path } from '@/modules/Node'

export const PackContentLocation  = {
  CATALOG: 0,
  LIBRARY: 1
}

function PackBadge ({ type, size = 'sm' }) {
  const { icon, color, label } = useMemo(() => {
    switch (type) {
      case PackVerificationStatus.UNKNOWN:
        return {
          icon: props => (
            <VerifiedCheckIcon
              {...props}
              color={colors.ICON_MUTED}
              secondaryColor={colors.ICON_MUTED}
            />
          ),
          color: Tooltip.Colors.PRIMARY,
          label: 'Unable to verify'
        }
      case PackVerificationStatus.UNVERIFIED:
        return {
          icon: props => <DangerIcon {...props} />,
          color: Tooltip.Colors.RED,
          label: 'Unverified'
        }
      case PackVerificationStatus.FAILED:
        return {
          icon: props => <DangerIcon {...props} />,
          color: Tooltip.Colors.RED,
          label: 'Verification failed'
        }
      case PackVerificationStatus.VERIFIED:
        return {
          icon: props => (
            <VerifiedCheckIcon
              {...props}
              color="var(--green-360)"
            />
          ),
          color: Tooltip.Colors.GREEN,
          label: 'Verified'
        }
      case PackVerificationStatus.OFFICIAL:
        return {
          icon: props => (
            <VerifiedCheckIcon
              {...props}
              color="var(--brand-500)"
            />
          ),
          color: Tooltip.Colors.BRAND,
          label: 'Official'
        }
    }
  }, [type])

  return (
    <Tooltip text={label} color={color}>
      {props => icon({ ...props, size })}
    </Tooltip>
  )
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

function PackField ({ icon, title, subtitle, children }) {
  return (
    <div className="BA__packField">
      <div className="BA__packFieldInfo">
        {icon}
        <div className="BA__packFieldInfoContent">
          <Text
            className="BA__packFieldTitle"
            variant="text-md/semibold"
            lineClamp={1}
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
  const hasUpdate = isInstalled && registry.hasUpdate(pack)

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

function PackContent ({ pack, className, size = 'sm', location = PackContentLocation.CATALOG }) {
  const registry = usePackRegistry()

  const authorAvatarSrc = registry.getAuthorAvatarSrc(pack)

  const showSource = useCallback(() => {
    if (location === PackContentLocation.CATALOG) handleClick({ href: registry.getSourceURL(pack.filename) })
    else DiscordNative.fileManager.showItemInFolder(
      path.resolve(PackManager.addonFolder, pack.filename)
    )
  }, [pack, location])

  return (
    <div
      className={classNames(
        'BA__packContent',
        `BA__packContent--${size}`,
        className
      )}
    >
      <TextBadge
        className="BA__packBadge"
        text="Badge"
      />
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
        <div className="BA__packHeader">
          <PackBadge
            type={registry.getVerificationStatus(pack)}
            size={size}
          />
          <Text
            variant={size === 'md' ? 'heading-lg/bold' : 'heading-md/bold'}
            tag="h2"
            lineClamp={2}
          >
            {pack.name}
          </Text>
        </div>
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
                <PackField
                  icon={(
                    <SquircleMask size={48}>
                      <img
                        className="BA__packServerIcon"
                        src="https://avatars.githubusercontent.com/u/52377180?s=60&v=4"
                        alt="Server Name"
                      />
                    </SquircleMask>
                  )}
                  title="Server Name"
                  subtitle="Support Server"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    text="Join"
                  />
                </PackField>
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
                  onClick={stop(() => handleClick({ href: `https://discord.gg/${pack.invite}` }))}
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
                <CircleWarningIcon size="md" color={colors.STATUS_DANGER} />
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
                    onClick={stop(() => registry.uninstall(pack.filename))} // TODO: Show confirmation with option to also delete the config file (also add irreversible alert for unpublished packs)
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
.BA__packHeader {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 6px;
}
.BA__packHeader svg {
    flex-shrink: 0;
}
.BA__packHeader h2,
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
}
.BA__packAuthorAvatar {
    border-radius: 50%;
}
.BA__packVersion {
    opacity: .7;
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
