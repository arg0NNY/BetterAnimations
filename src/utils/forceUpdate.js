
export function forceAppUpdate () {
  const appMount = document.getElementById('app-mount')
  const reactContainerKey = Object.keys(appMount).find((m) => m.startsWith('__reactContainer$'))
  let container = appMount[reactContainerKey]
  while (!container.stateNode?.isReactComponent) {
    container = container.child
  }
  const { render } = container.stateNode
  if (render.toString().includes('null')) return
  container.stateNode.render = () => null
  container.stateNode.forceUpdate(() => {
    container.stateNode.render = render
    container.stateNode.forceUpdate()
  })
}
