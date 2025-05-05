import { reservedKeys as sourceMapReservedKeys } from '@/modules/animation/sourceMap'

export const forbiddenKeys = [
  ...sourceMapReservedKeys,
  /**
   * Prevent manipulation with string coercion
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
   */
  'toString',
  'valueOf'
]

export const reservedKeys = [...forbiddenKeys, 'inject']

export function restrictKeys (keys) {
  return value => !keys.includes(value)
}
export const restrictForbiddenKeys = restrictKeys(forbiddenKeys)
export const restrictReservedKeys = restrictKeys(reservedKeys)
