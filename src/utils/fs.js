import { fs } from '@/modules/Node'

export const statSync = path => fs.existsSync(path) ? fs.statSync(path) : null
