import { React } from '@/BdApi'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@/enums/Events'
import Data from '@/modules/Data'

const DATA_KEY = 'hints'

function useHint (name) {
  const emit = useEmitterEffect(Events.HintUpdated)

  return [
    !!Data[DATA_KEY]?.[name],
    React.useCallback(value => {
      Data[DATA_KEY] = { ...Data[DATA_KEY], [name]: value }
      emit(Events.HintUpdated, name, value)
    }, [])
  ]
}

export default useHint
