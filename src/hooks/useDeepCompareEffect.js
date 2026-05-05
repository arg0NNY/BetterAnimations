import isEqual from 'lodash-es/isEqual'
import Logger from '@logger'
import useCustomCompareEffect from '@/hooks/useCustomCompareEffect'
import { isDev } from '@/env'

function useDeepCompareEffect (effect, deps) {
  if (isDev) {
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
