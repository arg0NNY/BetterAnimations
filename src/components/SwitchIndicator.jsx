import { Switch } from '@discord/modules'

// TODO: Migrate to the Mana SwitchIndicator component
function SwitchIndicator (props) {
  try {
    const value = Switch(props)
    try {
      return value.props.children({})
    }
    catch {
      return value
    }
  }
  catch {
    return <Switch {...props} />
  }
}

export default SwitchIndicator
