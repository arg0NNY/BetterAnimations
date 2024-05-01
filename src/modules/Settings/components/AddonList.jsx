import { React } from '@/BdApi'
import Events from '@/modules/Emitter'
import PackManager from '@/modules/PackManager'
import PackItem from '@/modules/Settings/components/PackItem'
import useForceUpdate from '@/hooks/useForceUpdate'

export default function AddonList ({ children, getList, prefix }) {
  prefix = prefix ?? 'pack'
  getList = getList ?? (() => PackManager.addonList)
  children = children ?? (pack => <PackItem pack={pack} key={pack.slug} />)

  const forceUpdate = useForceUpdate()

  React.useEffect(() => {
    Events.on(`${prefix}-loaded`, forceUpdate)
    Events.on(`${prefix}-unloaded`, forceUpdate)
    return () => {
      Events.off(`${prefix}-loaded`, forceUpdate)
      Events.off(`${prefix}-unloaded`, forceUpdate)
    }
  }, [prefix])

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {getList().map(children)}
    </div>
  )
}
