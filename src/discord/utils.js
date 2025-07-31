import { InviteStates } from '@discord/modules'

export function isInviteInvalid (invite) {
  return [InviteStates.EXPIRED, InviteStates.BANNED, InviteStates.ERROR]
    .includes(invite?.state)
}
