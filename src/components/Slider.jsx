import { Slider as DiscordSlider, Tooltip } from '@/modules/DiscordModules'
import { Patcher } from '@/BdApi'
import findInReactTree from '@/utils/findInReactTree'

class Slider extends DiscordSlider {
  render () {
    const { forceShowBubble = false, onValueRender } = this.props
    const value = super.render()
    if (forceShowBubble) {
      Patcher.after(value.props, 'children', (self, args, value) => {
        const tooltip = findInReactTree(value, m => m?.type === Tooltip)
        if (!tooltip) return

        tooltip.props.text = onValueRender(this.state.value)
      })
    }
    return value
  }

  componentDidUpdate (...args) {
    super.componentDidUpdate?.(...args)
    if (this.props.stickToMarkers) {
      const value = this.unscaleValue(
        this.state.markerPositions[this.state.newClosestIndex ?? this.state.closestMarkerIndex]
      )
      if (Math.abs(this.state.value - value) > .000001) this.setState({ value })
    }
  }
}

export default Slider
