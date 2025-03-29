import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@/enums/Events'
import Data from '@/modules/Data'
import { useCallback } from 'react'

const DATA_KEY = 'dismissibles'

function useDismissible (name) {
  const emit = useEmitterEffect(Events.HintUpdated)

  return [
    !!Data[DATA_KEY]?.[name],
    useCallback(value => {
      Data[DATA_KEY] = { ...Data[DATA_KEY], [name]: value }
      emit(Events.HintUpdated, name, value)
    }, [])
  ]
}

export default useDismissible
