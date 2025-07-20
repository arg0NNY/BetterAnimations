import VerifiedCheckIcon from '@/settings/components/icons/VerifiedCheckIcon'
import { Alert, AlertTypes, colors, Tooltip } from '@discord/modules'
import DangerIcon from '@/settings/components/icons/DangerIcon'
import TrashIcon from '@/settings/components/icons/TrashIcon'
import DownloadIcon from '@/settings/components/icons/DownloadIcon'
import config from '@config'

export const VerificationStatus = {
  UNKNOWN: 0,
  UNVERIFIED: 1,
  FAILED: 2,
  VERIFIED: 3,
  OFFICIAL: 4
}

export const VerificationIssueResolveMethod = {
  DELETE: 'delete',
  REINSTALL: 'reinstall',
  UPDATE: 'update',
  ALLOW_ONCE: 'allowOnce',
  ALLOW_ALWAYS: 'allowAlways'
}

export const verificationStatuses = Object.fromEntries(
  [
    {
      value: VerificationStatus.UNKNOWN,
      icon: props => (
        <VerifiedCheckIcon
          {...props}
          color={colors.ICON_MUTED}
          secondaryColor={colors.ICON_MUTED}
        />
      ),
      tooltipColor: Tooltip.Colors.PRIMARY,
      label: 'Unable to verify',
      description: (
        <>
          {config.name} was unable to verify this pack.
          It may contain malicious code, use it at your own risk.
        </>
      )
    },
    {
      value: VerificationStatus.UNVERIFIED,
      icon: props => <DangerIcon {...props} />,
      tooltipColor: Tooltip.Colors.RED,
      label: 'Unverified',
      description: (
        <>
          This pack has not been verified and may contain malicious code. {config.name} strongly recommends deleting it.
        </>
      )
    },
    {
      value: VerificationStatus.FAILED,
      icon: props => <DangerIcon {...props} />,
      tooltipColor: Tooltip.Colors.RED,
      label: 'Verification failed',
      description: (
        <>
          This pack has been verified, but the local copy you have installed differs from the one published in the official Catalog.
          The contents of this pack may have been modified by malicious code from a third party. {config.name} strongly recommends reinstalling it from the official Catalog before using it.
        </>
      )
    },
    {
      value: VerificationStatus.VERIFIED,
      icon: props => (
        <VerifiedCheckIcon
          {...props}
          color="var(--green-360)"
        />
      ),
      tooltipColor: Tooltip.Colors.GREEN,
      label: 'Verified',
      description: (
        <>
          This community pack has been verified by {config.name} and is safe to use.
        </>
      )
    },
    {
      value: VerificationStatus.OFFICIAL,
      icon: props => (
        <VerifiedCheckIcon
          {...props}
          color="var(--brand-500)"
        />
      ),
      tooltipColor: Tooltip.Colors.BRAND,
      label: 'Official',
      description: (
        <>
          This is the official pack from the authors of {config.name} and is safe to use.
        </>
      )
    }
  ].map(item => [item.value, item])
)

export const verificationIssueResolveMethods = Object.fromEntries(
  [
    {
      value: VerificationIssueResolveMethod.DELETE,
      variant: 'critical-primary',
      icon: TrashIcon,
      label: 'Delete permanently'
    },
    {
      value: VerificationIssueResolveMethod.REINSTALL,
      variant: 'primary',
      icon: DownloadIcon,
      label: 'Reinstall'
    },
    {
      value: VerificationIssueResolveMethod.UPDATE,
      variant: 'primary',
      icon: DownloadIcon,
      label: 'Update'
    },
    {
      value: VerificationIssueResolveMethod.ALLOW_ONCE,
      variant: 'critical-primary',
      label: 'Allow once',
      confirmation: {
        text: pack => (
          <>
            <p>
              By selecting this option, you grant the pack <b>{pack.name}</b> full access to your Discord client during the current session.
              Animations of this pack may try to execute malicious code to harm the client or compromise your Discord account.
            </p>
            <p>
              Only proceed if you know what you're doing or if you are the author of this pack.
            </p>
          </>
        ),
        confirmText: 'Allow once anyway'
      }
    },
    {
      value: VerificationIssueResolveMethod.ALLOW_ALWAYS,
      variant: 'critical-primary',
      label: 'Allow all the time',
      confirmation: {
        text: pack => (
          <>
            <p>
              By selecting this option, you grant the pack <b>{pack.name}</b> full access to your Discord client <b>permanently</b>.
              Animations of this pack may try to execute malicious code to harm the client or compromise your Discord account.
            </p>
            <p>
              Only proceed if you know what you're doing or if you are the author of this pack.
            </p>
            <Alert messageType={AlertTypes.WARNING}>
              Note that if the contents of this pack change, {config.name} will not ask for confirmation
              and will automatically grant full access to this pack if you choose to allow it all the time.
            </Alert>
          </>
        ),
        confirmText: 'Allow all the time anyway'
      }
    }
  ].map(item => [item.value, item])
)
