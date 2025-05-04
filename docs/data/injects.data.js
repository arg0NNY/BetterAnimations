import fs from 'node:fs'
import MarkdownIt from 'markdown-it'
import { headersPlugin } from '@mdit-vue/plugin-headers'

const md = MarkdownIt({ html: true })
  .use(headersPlugin, { level: [2] })

export default {
  watch: ['../reference/injects/*.md'],
  load (files) {
    return Object.fromEntries(
      files.flatMap(file => {
        const path = file.slice(4, -3)
        const env = {}
        md.render(fs.readFileSync(file, 'utf8'), env)
        return env.headers.map(({ title, link }) => [title, path + link])
      })
    )
  }
}
