import { z } from 'zod'

export const trustedFunctionSymbol = Symbol('trustedFunction')

export function trust (fn) {
  fn[trustedFunctionSymbol] = true
  return fn
}

const TrustedFunctionSchema = z.instanceof(Function)
  .superRefine((value, ctx) => {
    if (!value[trustedFunctionSymbol]) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Untrusted function',
      params: { received: value }
    })
  })

export default TrustedFunctionSchema
