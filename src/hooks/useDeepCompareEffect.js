import isEqual from 'lodash-es/isEqual'
import Logger from '@/modules/Logger'
import useCustomCompareEffect from '@/hooks/useCustomCompareEffect'

function useDeepCompareEffect (effect, deps) {
  if (import.meta.env.MODE === 'development') {
    if (!Array.isArray(deps) || !deps.length) {
      Logger.warn(
        'useDeepCompareEffect',
        '`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead.',
      )
    }
  }

  useCustomCompareEffect(effect, deps, isEqual)
}

export default useDeepCompareEffect
