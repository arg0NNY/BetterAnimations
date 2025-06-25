import { css } from '@style'
import classNames from 'classnames'

function ErrorCard ({ children, actions, className, ...props }) {
  return (
    <div {...props} className={classNames('BA__errorCard', className)}>
      {children}
      {actions && (
        <div className="BA__errorCardActions">
          {actions}
        </div>
      )}
    </div>
  )
}

export default ErrorCard

css
`.BA__errorCard {
    padding: 16px;
    background-color: #e7828430;
    border: 1px solid #e78284;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    text-align: center;
    min-width: 170px;
}
.BA__errorCard a:hover {
    text-decoration: underline;
}
.BA__errorCardActions {
    display: flex;
    align-items: center;
    gap: 8px;
}`
`ErrorCard`
