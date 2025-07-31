import Patcher from '@/modules/Patcher'
import ModuleKey from '@enums/ModuleKey'
import { Mana } from '@discord/modules'
import Core from '@/modules/Core'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import DiscordClasses from '@discord/classes'
import AnimeContainer from '@components/AnimeContainer'
import { cloneElement } from 'react'
import classNames from 'classnames'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'

function patchManaModalRoot () {
  Patcher.after(ModuleKey.Modals, ...Mana.ModalRootKeyed, (self, args, value) => {
    const module = Core.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    const container = findInReactTree(value, byClassName(DiscordClasses.ManaModal.container))
    if (!container) return

    Object.assign(container, (
      <AnimeContainer
        id={ModuleKey.Modals}
        container={{
          className: classNames(
            'BA__manaModalContainer',
            container.props.className
          )
        }}
      >
        {cloneElement(container)}
      </AnimeContainer>
    ))
  })
}

export default patchManaModalRoot

css
`.BA__manaModalContainer {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    border-radius: 0 !important;
}

${DiscordSelectors.ManaModal.container} {
    min-height: 0;
}`
`ManaModalRoot`
