import Patcher, { TinyPatcher } from '@/modules/Patcher'
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
import useModule from '@/hooks/useModule'
import useWindow from '@/hooks/useWindow'

function renderContainer (value) {
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
}

function patchManaModals () {
  Patcher.after(ModuleKey.Modals, ...Mana.ModalRootKeyed, (self, args, value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Modals)
    if (!isMainWindow || !module.isEnabled()) return

    renderContainer(value)
  })
  Patcher.after(ModuleKey.Modals, ...Mana.LayerModalKeyed, (self, args, value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Modals)
    if (!isMainWindow || !module.isEnabled()) return

    const wrapper = findInReactTree(value, m => typeof m?.children === 'function')
    if (!wrapper) return

    TinyPatcher.after(ModuleKey.Modals, wrapper, 'children', (self, args, value) => {
      renderContainer(value)
    })
  })
}

export default patchManaModals

css
`.BA__manaModalContainer {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    border-radius: 0 !important;
    overflow: visible;
}

${DiscordSelectors.ManaModal.container} {
    min-height: 0;
}
${DiscordSelectors.ManaModal.container} > ${DiscordSelectors.ManaModal.container} {
    width: 100% !important;
    height: 100% !important;
}`
`ManaModalRoot`
