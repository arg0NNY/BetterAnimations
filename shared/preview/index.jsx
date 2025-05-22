import { css } from '@style'
import Main from '@preview/views/Main'

function Preview () {
  return (
    <div className="BAP__container">
      <Main />
    </div>
  )
}

export default Preview

css
`.BAP__container {
    --background-primary: #202024;
    --background-secondary: #1A1A1E;
    --background-secondary-alt: #18181C;
    --background-tertiary: #121214;
    --background-surface-overlay: #242429;
    --border-subtle: rgba(151, 151, 159, .12);
    --text-primary: #3B3D42;
    --text-heading: #505357;
    --brand-primary: #5865F2;
    
    position: relative;
    width: 1280px;
    height: 720px;
    font-size: 16px;
    color: var(--text-primary);
    background-color: var(--background-tertiary);
    overflow: hidden;
}
.BAP__container > * {
    position: absolute;
    inset: 0;
}
.BAP__container * {
    border-color: var(--border-subtle);
    border-style: solid;
    border-width: 0;
}`
`Preview`
