import Enum from '@shared/Enum'

export default function Auto (enumInstance) {
  if (!enumInstance) return 'auto'

  return Enum({
    ...enumInstance.raw,
    Auto: 'auto'
  })
}
