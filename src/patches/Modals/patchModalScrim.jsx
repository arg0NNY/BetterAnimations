import Patcher from '@/modules/Patcher'
import { ModalScrimKeyed } from '@discord/modules'
import { css } from '@style'
import AnimeTransition from '@components/AnimeTransition'
import classNames from 'classnames'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { ErrorBoundary } from '@error/boundary'

function ModalBackdrop ({ isVisible, onClick, disabled = false, disablePointerEvents = false, ...props }) {
  return (
    <AnimeTransition
      {...props}
      in={isVisible}
      container={{
        className: classNames({
          'BA__backdropContainer': true,
          'BA__backdropContainer--disablePointerEvents': disablePointerEvents
        })
      }}
      appear={true}
      defaultLayoutStyles={false}
    >
      <div
        className="BA__backdrop"
        onClick={disabled ? undefined : onClick}
      />
    </AnimeTransition>
  )
}

function patchModalScrim () {
  Patcher.after(ModuleKey.ModalsBackdrop, ...ModalScrimKeyed, (self, [props], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!isMainWindow || !module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <ModalBackdrop
          {...props}
          module={module}
        />
      </ErrorBoundary>
    )
  })
}

export default patchModalScrim

css
`.BA__backdropContainer {
    position: fixed;
    inset: 0;
    right: var(--devtools-sidebar-width, 0);
    pointer-events: auto;
}
.BA__backdropContainer--disablePointerEvents {
    pointer-events: none;
}
.BA__backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, .7);
}`
`ModalScrim`
