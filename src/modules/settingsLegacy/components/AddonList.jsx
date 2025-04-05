import { React } from '@/BdApi'
import Emitter from '@/modules/Emitter'
import PackManager from '@/modules/PackManager'
import PackItem from '@/modules/settingsLegacy/components/PackItem'
import useForceUpdate from '@/hooks/useForceUpdate'

export default function AddonList ({ children, getList, prefix }) {
  prefix = prefix ?? 'pack'
  getList = getList ?? (() => PackManager.getAllPacks())
  children = children ?? (pack => <PackItem pack={pack} key={pack.slug} />)

  const forceUpdate = useForceUpdate()

  React.useEffect(() => {
    Emitter.on(`${prefix}-loaded`, forceUpdate)
    Emitter.on(`${prefix}-unloaded`, forceUpdate)
    return () => {
      Emitter.off(`${prefix}-loaded`, forceUpdate)
      Emitter.off(`${prefix}-unloaded`, forceUpdate)
    }
  }, [prefix])

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {getList().map(children)}
    </div>
  )
}
