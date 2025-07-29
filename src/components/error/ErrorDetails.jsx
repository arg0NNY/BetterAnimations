import { css } from '@style'
import IconBrand from '@/components/icons/IconBrand'
import Divider from '@/components/Divider'
import {
  Alert,
  AlertTypes,
  colors,
  FormTitle,
  InviteEmbed,
  InviteStore,
  Parser,
  Text,
  useStateFromStores
} from '@discord/modules'
import meta from '@/meta'
import DiscordClasses from '@discord/classes'
import InternalError from '@error/structs/InternalError'
import AddonError from '@error/structs/AddonError'
import AnimationError from '@error/structs/AnimationError'
import ErrorDetailsActions from '@/components/error/ErrorDetailsActions'
import { useMemo } from 'react'
import { attempt, ErrorBoundary } from '@error/boundary'
import { isInviteInvalid } from '@discord/utils'
import LibraryIcon from '@/settings/components/icons/LibraryIcon'

function ErrorDetails ({ error, open = false }) {
  const icon = useMemo(() => {
    if (error instanceof AnimationError || error instanceof AddonError)
      return <LibraryIcon size="md" />
    return <IconBrand size="lg" color={colors.INTERACTIVE_NORMAL} />
  }, [error])

  const title = useMemo(() => {
    if (error instanceof InternalError) return 'Internal error'
    if (error.pack) return error.pack.name
    return 'Unclassified error'
  }, [error])

  const hint = useMemo(() => {
    if (error instanceof InternalError)
      return <>
        {error.module ? `${error.module.name} animations` : `Some parts of ${meta.name}`} may&nbsp;not&nbsp;work or&nbsp;function&nbsp;incorrectly.
      </>
    if (error instanceof AddonError)
      return <>
        This pack cannot be&nbsp;loaded due to an&nbsp;unexpected error.
      </>
    if (error instanceof AnimationError)
      return <>
        An unexpected error occurred in the&nbsp;"{error.animation.name}"&nbsp;animation on&nbsp;{error.module.name}.
      </>
    return 'Unknown error occurred.'
  }, [error])

  const code = useMemo(() => {
    if (error instanceof InternalError) return meta.invite
    return error.pack?.invite
  }, [error])

  const invite = useStateFromStores([InviteStore], () => isInviteInvalid(InviteStore.getInvite(code)) ? null : code)

  const alert = useMemo(() => {
    if (invite) return 'Go to the Support Server to get help with this error:'
    if (error.pack) return `Reach out to the pack's author${error.pack.author ? ` (${error.pack.author})` : ''} to get help with this error.`
    return null
  }, [error, invite])

  const content = `${error.name}: ` + error.message
  const codeBlock = attempt(
    () => Parser.codeBlock.react({ content, lang: 'json' }, null, {}),
    () => <pre><code className="hljs">{content}</code></pre>
  )

  return (
    <details className="BA__errorDetails" open={open}>
      <summary className="BA__errorDetailsHeader">
        <div className="BA__errorDetailsIcon">
          {icon}
        </div>
        <div className="BA__errorDetailsHeaderInner">
          <Text
            tag="h3"
            variant="heading-md/semibold"
          >
            {title}
          </Text>
          <div className="BA__errorDetailsHeading">
            <svg className="BA__errorDetailsHeadingIcon" aria-hidden="false" width="16" height="16" viewBox="0 0 12 12">
              <path fill="currentColor" d="M6 1C3.243 1 1 3.244 1 6c0 2.758 2.243 5 5 5s5-2.242 5-5c0-2.756-2.243-5-5-5zm0 2.376a.625.625 0 110 1.25.625.625 0 010-1.25zM7.5 8.5h-3v-1h1V6H5V5h1a.5.5 0 01.5.5v2h1v1z"></path>
            </svg>
            <Text
              variant="text-xs/normal"
              color="header-secondary"
            >
              {hint}
            </Text>
          </div>
        </div>
        <svg className="BA__errorDetailsExpander" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 10L12 15 17 10" aria-hidden="true"></path>
        </svg>
      </summary>
      <div className="BA__errorDetailsBody">
        <Divider />

        <ErrorDetailsActions
          className={DiscordClasses.Margins.marginBottom20}
          error={error}
        />

        <FormTitle>Error</FormTitle>
        <div className="BA__errorDetailsStack">
          {codeBlock}
        </div>

        <ErrorBoundary noop>
          {alert ? (
            <Alert
              messageType={AlertTypes.INFO}
              className={DiscordClasses.Margins.marginTop20}
            >
              <div>{alert}</div>
              {invite ? (
                <div className="BA__errorDetailsInvite">
                  <InviteEmbed
                    code={invite}
                    message={{
                      author: { username: error.pack?.author }
                    }}
                    getAcceptInviteContext={() => ({})}
                  />
                </div>
              ) : null}
            </Alert>
          ) : null}
        </ErrorBoundary>
      </div>
    </details>
  )
}

export default ErrorDetails

css
`.BA__errorDetails {
    position: relative;
    border-radius: 8px;
    padding: 0;
    background: var(--background-base-lower);
    border: 1px solid var(--border-subtle);
}

.BA__errorDetailsHeader {
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 20px 16px;
    cursor: pointer;
    outline: none;
}

.BA__errorDetailsHeader:focus-visible {
    box-shadow: 0 0 0 4px var(--focus-primary);
}

.BA__errorDetailsIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    background-color: var(--background-base-lowest);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 10px;
}

.BA__errorDetailsIcon svg {
    fill: var(--interactive-normal);
}

.BA__errorDetailsExpander {
    transform: rotate(-90deg);
    color: var(--interactive-normal);
    transition: transform 0.2s ease;
}

.BA__errorDetails[open] .BA__errorDetailsExpander {
    transform: none;
}

.BA__errorDetailsExpander,
.BA__errorDetailsIcon {
    flex: 0 0 auto;
}

.BA__errorDetailsHeaderInner {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

.BA__errorDetailsBody {
    padding: 0 16px 24px;
}

.BA__errorDetailsBody .BA__divider {
    margin-bottom: 24px;
}

.BA__errorDetailsHeading {
    display: flex;
    flex-grow: 0;
    justify-content: flex-start;
    margin-top: 4px;
}

.BA__errorDetailsHeadingIcon {
    margin-right: 4px;
    color: var(--interactive-normal);
}

.BA__errorDetailsStack code {
    user-select: text;
    font-size: 0.875rem;
    line-height: 1.125rem;
    text-indent: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--background-base-lowest) var(--background-base-lower);
    background: var(--background-base-lower);
    border: 1px solid var(--background-base-lowest);
}

.BA__errorDetailsStack pre {
    position: relative;
}

.BA__errorDetailsStack pre [class^="codeActions"] {
    position: absolute;
    display: none;
    right: 4px;
    top: 8px;
    color: var(--text-default);
}

.BA__errorDetailsStack pre:hover [class^="codeActions"] {
    display: block;
}

.BA__errorDetailsStack pre [class^="codeActions"] > div {
    cursor: pointer;
}

.BA__errorDetailsInvite {
    margin-top: 8px;
}
.BA__errorDetailsInvite > div {
    max-width: none;
}`
`ErrorDetails`