import { Button, colors, Text, TextBadge, Tooltip } from '@discord/modules'
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
import { useMemo } from 'react'
import DangerIcon from '@/settings/components/icons/DangerIcon'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'

const PackBadgeTypes = {
  UNVERIFIED: 0,
  VERIFIED: 1,
  OFFICIAL: 2
}

function PackBadge ({ type = PackBadgeTypes.UNVERIFIED, size = 'sm' }) {
  const text = useMemo(() => {
    switch (type) {
      case PackBadgeTypes.UNVERIFIED: return 'Unverified'
      case PackBadgeTypes.VERIFIED: return 'Verified'
      case PackBadgeTypes.OFFICIAL: return 'Official'
    }
  }, [type])

  const color = useMemo(() => {
    switch (type) {
      case PackBadgeTypes.UNVERIFIED: return Tooltip.Colors.RED
      case PackBadgeTypes.VERIFIED: return Tooltip.Colors.GREEN
      case PackBadgeTypes.OFFICIAL: return Tooltip.Colors.BRAND
    }
  }, [type])

  return (
    <Tooltip text={text} color={color}>
      {props => (
        type === PackBadgeTypes.UNVERIFIED ? (
          <DangerIcon
            {...props}
            size={size}
          />
        ) : (
          <VerifiedCheckIcon
            {...props}
            size={size}
            color={type === PackBadgeTypes.OFFICIAL ? 'var(--brand-500)' : 'var(--green-360)'}
          />
        )
      )}
    </Tooltip>
  )
}
PackBadge.Types = PackBadgeTypes

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

function PackContent ({ className, size = 'sm' }) {
  return (
    <div
      className={classNames(
        'BA__packContent',
        `BA__packContent--${size}`,
        className
      )}
    >
      <TextBadge className="BA__packBadge" text="New" />
      <div className="BA__packSplash">
        <img
          className="BA__packSplashImage"
          src="https://betterdiscord.app/resources/store/missing.svg"
          loading="lazy"
          alt="Pack Name"
          draggable="false"
        />
        {size === 'sm' && (
          <Tooltip text="arg0NNY">
            {props => (
              <div
                {...props}
                className="BA__packSplashAuthor"
              >
                <img
                  className="BA__packAuthorAvatar"
                  src="https://avatars.githubusercontent.com/u/52377180?s=60&v=4"
                  alt="arg0NNY"
                />
              </div>
            )}
          </Tooltip>
        )}
      </div>
      <div className="BA__packContentContainer">
        <div className="BA__packHeader">
          <PackBadge
            type={PackBadge.Types.OFFICIAL}
            size={size}
          />
          <Text
            variant={size === 'md' ? 'heading-lg/bold' : 'heading-md/bold'}
            tag="h2"
            lineClamp={2}
          >
            Pack Name
          </Text>
        </div>
        <Text
          className={classNames('BA__packDescription', DiscordClasses.Scroller.thin)}
          variant="text-sm/medium"
          color="text-muted"
          lineClamp={size === 'sm' && 2}
        >
          Pack Description
        </Text>
        <div className="BA__packContentSpacer" />
        <div className="BA__packFooter">
          {size === 'md' ? (
            <>
              <div>
                <PackField
                  icon={(
                    <img
                      className="BA__packAuthorAvatar"
                      src="https://avatars.githubusercontent.com/u/52377180?s=60&v=4"
                      alt="arg0NNY"
                    />
                  )}
                  title="arg0NNY"
                  subtitle="Author"
                >
                  <Tooltip text="Author's Page">
                    {props => (
                      <Button
                        {...props}
                        variant="secondary"
                        size="sm"
                        icon={LinkIcon}
                      />
                    )}
                  </Tooltip>
                  <Tooltip text="Donate">
                    {props => (
                      <Button
                        {...props}
                        variant="active"
                        size="sm"
                        icon={CircleDollarSignIcon}
                      />
                    )}
                  </Tooltip>
                </PackField>
                <PackField
                  icon={(
                    <SquircleMask size={48}>
                      <img
                        className="BA__packServerIcon"
                        src="https://avatars.githubusercontent.com/u/52377180?s=60&v=4"
                        alt="arg0NNY's Lounge"
                      />
                    </SquircleMask>
                  )}
                  title="arg0NNY's Lounge"
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
                icon={GitHubIcon}
                text="slug.pack.json"
                fullWidth
              />
            </>
          ) : (
            <div className="BA__packMeta">
              <IconButton tooltip="Source">
                <GitHubIcon size="sm" color="currentColor"/>
              </IconButton>
              <IconButton tooltip="Support Server">
                <CircleQuestionIcon size="sm" color="currentColor"/>
              </IconButton>
            </div>
          )}
          <div class="BA__packActions">
            <IconButton tooltip="An error occurred">
              <CircleWarningIcon size="md" color={colors.STATUS_DANGER} />
            </IconButton>
            <Button
              icon={CheckIcon}
              variant="active"
              size={size}
              disabled
              fullWidth={size === 'md'}
              text={(
                <>
                  <span>Installed</span>
                  {size === 'md' && (
                    <PackVersion version="1.0.0" from="0.0.0" />
                  )}
                </>
              )}
            />
            <Tooltip text="Uninstall">
              {props => (
                <Button
                  {...props}
                  variant="critical-primary"
                  size={size}
                  icon={TrashIcon}
                />
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

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
