import { reservedKeys as sourceMapReservedKeys } from '@/modules/animation/sourceMap'

export const forbiddenKeys = [...sourceMapReservedKeys]

export const reservedKeys = [...forbiddenKeys, 'inject']
