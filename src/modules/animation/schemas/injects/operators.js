import * as z from 'zod'
import { InjectSchema } from '@/modules/animation/schemas/utils'
import Inject from '@/enums/Inject'
import { zodTransformErrorBoundary } from '@/utils/zod'
import { clearSourceMap } from '@/modules/animation/sourceMap'

const OperatorInjectSchema = (inject, fn) => InjectSchema(inject).extend({
  a: z.any(),
  b: z.any()
}).transform(
  zodTransformErrorBoundary(({ a, b }) => fn(
    clearSourceMap(a),
    clearSourceMap(b)
  ))
)

export const AdditionOperatorInjectSchema = OperatorInjectSchema(Inject.AdditionOperator, (a, b) => a + b)
export const DivisionOperatorInjectSchema = OperatorInjectSchema(Inject.DivisionOperator, (a, b) => a / b)
export const EqualityOperatorInjectSchema = OperatorInjectSchema(Inject.EqualityOperator, (a, b) => a == b)
export const GreaterThanOperatorInjectSchema = OperatorInjectSchema(Inject.GreaterThanOperator, (a, b) => a > b)
export const GreaterThanOrEqualOperatorInjectSchema = OperatorInjectSchema(Inject.GreaterThanOrEqualOperator, (a, b) => a >= b)
export const InOperatorInjectSchema = OperatorInjectSchema(Inject.InOperator, (a, b) => a in b)
export const InequalityOperatorInjectSchema = OperatorInjectSchema(Inject.InequalityOperator, (a, b) => a != b)
export const LessThanOperatorInjectSchema = OperatorInjectSchema(Inject.LessThanOperator, (a, b) => a < b)
export const LessThanOrEqualOperatorInjectSchema = OperatorInjectSchema(Inject.LessThanOrEqualOperator, (a, b) => a <= b)
export const LogicalAndOperatorInjectSchema = OperatorInjectSchema(Inject.LogicalAndOperator, (a, b) => a && b)
export const LogicalNotOperatorInjectSchema = InjectSchema(Inject.LogicalNotOperator)
  .extend({ value: z.any() })
  .transform(({ value }) => !value)
export const LogicalOrOperatorInjectSchema = OperatorInjectSchema(Inject.LogicalOrOperator, (a, b) => a || b)
export const MultiplicationOperatorInjectSchema = OperatorInjectSchema(Inject.MultiplicationOperator, (a, b) => a * b)
export const NullishCoalescingOperatorInjectSchema = OperatorInjectSchema(Inject.NullishCoalescingOperator, (a, b) => a ?? b)
export const RemainderOperatorInjectSchema = OperatorInjectSchema(Inject.RemainderOperator, (a, b) => a % b)
export const StrictEqualityOperatorInjectSchema = OperatorInjectSchema(Inject.StrictEqualityOperator, (a, b) => a === b)
export const StrictInequalityOperatorInjectSchema = OperatorInjectSchema(Inject.StrictInequalityOperator, (a, b) => a !== b)
export const SubtractionOperatorInjectSchema = OperatorInjectSchema(Inject.SubtractionOperator, (a, b) => a - b)
