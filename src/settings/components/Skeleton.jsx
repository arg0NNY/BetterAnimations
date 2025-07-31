import { css } from '@style'
import classNames from 'classnames'

function Skeleton ({ className, rounded = true, animated = true, width, height, style, ...props }) {
  return (
    <div
      className={classNames({
        'BA__skeleton': true,
        'BA__skeleton--rounded': rounded,
        'BA__skeleton--animated': animated
      }, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

export default Skeleton

css
`.BA__skeleton {
    display: inline-block;
    height: 1em;
    width: 100px;
    background-color: var(--text-default);
    opacity: .15;
}
.BA__skeleton--rounded {
    border-radius: 999px;
}
.BA__skeleton--animated {
    animation: BA__skeletonAnimation 1.5s ease infinite;
}

@keyframes BA__skeletonAnimation {
    0%, 100% { opacity: .15; }
    50% { opacity: .075; }
}`
`Skeleton`
