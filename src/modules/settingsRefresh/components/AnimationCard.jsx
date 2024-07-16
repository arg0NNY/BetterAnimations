import { css } from '@/modules/Style'
import AnimationPreview from '@/modules/settingsRefresh/components/AnimationPreview'
import AnimationCardControls from '@/modules/settingsRefresh/components/AnimationCardControls'
import BackgroundOptionRing from '@/modules/settingsRefresh/components/BackgroundOptionRing'

function AnimationCard ({ animation, enter, exit, setEnter, setExit, onClick }) {
  return (
    <div className="BA__animationCardWrapper">
      <div className="BA__animationCardBackdrop"></div>
      <div className="BA__animationCardPositioner">
        <div className="BA__animationCard" onClick={onClick}>
          {(enter || exit) && <BackgroundOptionRing />}
          <AnimationPreview title={animation.name} />
          <AnimationCardControls
            animation={animation}
            enter={enter}
            exit={exit}
            setEnter={setEnter}
            setExit={setExit}
          />
        </div>
      </div>
    </div>
  )
}

export default AnimationCard

css
`.BA__animationCardWrapper {
    min-width: 0;
}
    
.BA__animationCardPositioner {
    position: relative;
    height: 164px;
}

.BA__animationCard {
    position: relative;
    padding: 8px;
    border-radius: 8px;
    background-color: var(--background-secondary);
    cursor: pointer;
    transition: background-color .2s;
}
.BA__animationCard:hover {
    background-color: var(--background-secondary-alt);
}`
`AnimationCard`
