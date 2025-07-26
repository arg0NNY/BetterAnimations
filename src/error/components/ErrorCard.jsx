import { css } from '@style'
import classNames from 'classnames'
import IconBrand, { IconBrandTypes } from '@/components/icons/IconBrand'
import { Text } from '@discord/modules'

function ErrorCard ({ text, actions, className, iconType = IconBrandTypes.ERROR, ...props }) {
  return (
    <div {...props} className={classNames('BA__errorCard', className)}>
      <IconBrand
        type={iconType}
        size="xl"
      />
      <Text variant="text-md/bold">{text}</Text>
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
