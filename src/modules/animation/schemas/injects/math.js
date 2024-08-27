import { z } from 'zod'
import { InjectSchema, InjectWithMeta } from '@/modules/animation/schemas/utils'
import Inject from '@/enums/Inject'
import { ArrayOrSingleSchema } from '@/helpers/schemas'

const MathConstantInjectSchema = (inject, value) => InjectWithMeta(
  InjectSchema(inject).transform(() => value),
  { immediate: true }
)

const MathSingleInjectSchema = (inject, fn) => InjectSchema(inject).extend({
  value: z.number()
}).transform(({ value }) => fn(value))

const MathMultipleInjectSchema = (inject, fn) => InjectSchema(inject).extend({
  values: ArrayOrSingleSchema(z.number())
}).transform(({ values }) => fn(...[].concat(values)))

export const MathAbsInjectSchema = MathSingleInjectSchema(Inject.MathAbs, Math.abs)
export const MathAcosInjectSchema = MathSingleInjectSchema(Inject.MathAcos, Math.acos)
export const MathAcoshInjectSchema = MathSingleInjectSchema(Inject.MathAcosh, Math.acosh)
export const MathAsinInjectSchema = MathSingleInjectSchema(Inject.MathAsin, Math.asin)
export const MathAsinhInjectSchema = MathSingleInjectSchema(Inject.MathAsinh, Math.asinh)
export const MathAtanInjectSchema = MathSingleInjectSchema(Inject.MathAtan, Math.atan)
export const MathAtan2InjectSchema = InjectSchema(Inject.MathAtan2).extend({
  y: z.number(),
  x: z.number()
}).transform(({ y, x }) => Math.atan2(y, x))
export const MathAtanhInjectSchema = MathSingleInjectSchema(Inject.MathAtanh, Math.atanh)
export const MathCbrtInjectSchema = MathSingleInjectSchema(Inject.MathCbrt, Math.cbrt)
export const MathCeilInjectSchema = MathSingleInjectSchema(Inject.MathCeil, Math.ceil)
export const MathClz32InjectSchema = MathSingleInjectSchema(Inject.MathClz32, Math.clz32)
export const MathCosInjectSchema = MathSingleInjectSchema(Inject.MathCos, Math.cos)
export const MathCoshInjectSchema = MathSingleInjectSchema(Inject.MathCosh, Math.cosh)
export const MathExpInjectSchema = MathSingleInjectSchema(Inject.MathExp, Math.exp)
export const MathExpm1InjectSchema = MathSingleInjectSchema(Inject.MathExpm1, Math.expm1)
export const MathFloorInjectSchema = MathSingleInjectSchema(Inject.MathFloor, Math.floor)
export const MathFroundInjectSchema = MathSingleInjectSchema(Inject.MathFround, Math.fround)
export const MathHypotInjectSchema = MathMultipleInjectSchema(Inject.MathHypot, Math.hypot)
export const MathImulInjectSchema = InjectSchema(Inject.MathImul).extend({
  a: z.number(),
  b: z.number()
}).transform(({ a, b }) => Math.imul(a, b))
export const MathLogInjectSchema = MathSingleInjectSchema(Inject.MathLog, Math.log)
export const MathLog1pInjectSchema = MathSingleInjectSchema(Inject.MathLog1p, Math.log1p)
export const MathLog10InjectSchema = MathSingleInjectSchema(Inject.MathLog10, Math.log10)
export const MathLog2InjectSchema = MathSingleInjectSchema(Inject.MathLog2, Math.log2)
export const MathMaxInjectSchema = MathMultipleInjectSchema(Inject.MathMax, Math.max)
export const MathMinInjectSchema = MathMultipleInjectSchema(Inject.MathMin, Math.min)
export const MathPowInjectSchema = InjectSchema(Inject.MathPow).extend({
  base: z.number(),
  exponent: z.number()
}).transform(({ base, exponent }) => Math.pow(base, exponent))
export const MathRandomInjectSchema = InjectWithMeta(
  InjectSchema(Inject.MathRandom).transform(() => Math.random()),
  { immediate: true }
)
export const MathRoundInjectSchema = MathSingleInjectSchema(Inject.MathRound, Math.round)
export const MathSignInjectSchema = MathSingleInjectSchema(Inject.MathSign, Math.sign)
export const MathSinInjectSchema = MathSingleInjectSchema(Inject.MathSin, Math.sin)
export const MathSinhInjectSchema = MathSingleInjectSchema(Inject.MathSinh, Math.sinh)
export const MathSqrtInjectSchema = MathSingleInjectSchema(Inject.MathSqrt, Math.sqrt)
export const MathTanInjectSchema = MathSingleInjectSchema(Inject.MathTan, Math.tan)
export const MathTanhInjectSchema = MathSingleInjectSchema(Inject.MathTanh, Math.tanh)
export const MathTruncInjectSchema = MathSingleInjectSchema(Inject.MathTrunc, Math.trunc)

export const MathEInjectSchema = MathConstantInjectSchema(Inject.MathE, Math.E)
export const MathLN10InjectSchema = MathConstantInjectSchema(Inject.MathLN10, Math.LN10)
export const MathLN2InjectSchema = MathConstantInjectSchema(Inject.MathLN2, Math.LN2)
export const MathLOG10EInjectSchema = MathConstantInjectSchema(Inject.MathLOG10E, Math.LOG10E)
export const MathLOG2EInjectSchema = MathConstantInjectSchema(Inject.MathLOG2E, Math.LOG2E)
export const MathPIInjectSchema = MathConstantInjectSchema(Inject.MathPI, Math.PI)
export const MathSQRT1_2InjectSchema = MathConstantInjectSchema(Inject.MathSQRT1_2, Math.SQRT1_2)
export const MathSQRT2InjectSchema = MathConstantInjectSchema(Inject.MathSQRT2, Math.SQRT2)
