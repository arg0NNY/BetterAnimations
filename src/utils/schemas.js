import { z } from 'zod'
import isElement from 'lodash-es/isElement'

export const Literal = z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
export const Defined = z.any().refine(v => v !== undefined, { message: 'Must be defined' })
export const ArrayOrSingleSchema = value => z.union([z.array(value), value])

export const formatValuesList = (arr, separator = ', ') => arr.map(i => `'${i}'`).join(separator)

export const FunctionSchema = z.custom(v => typeof v === 'function', 'Input is not a function')
export const DOMElementSchema = z.custom(isElement, 'Input is not an Element')
