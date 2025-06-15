import Enum from '@shared/enum'

export default function Auto (enumInstance) {
  if (!enumInstance) return 'auto'

  return Enum({
    ...enumInstance.raw,
    Auto: 'auto'
  })
}
