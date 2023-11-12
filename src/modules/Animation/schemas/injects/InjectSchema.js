import { z } from 'zod'

export const InjectSchema = type => z.object({ inject: z.literal(type) }).strict()
