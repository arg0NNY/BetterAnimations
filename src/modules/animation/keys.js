import { reservedKeys as sourceMapReservedKeys } from '@/modules/animation/sourceMap'

export const forbiddenKeys = [...sourceMapReservedKeys]

export const reservedKeys = [...forbiddenKeys, 'inject']

export function restrictKeys (keys) {
  return value => !keys.includes(value)
}
export const restrictForbiddenKeys = restrictKeys(forbiddenKeys)
export const restrictReservedKeys = restrictKeys(reservedKeys)
