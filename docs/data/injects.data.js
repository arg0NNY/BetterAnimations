import fs from 'node:fs'
import { createMarkdownRenderer } from 'vitepress'

const config = global.VITEPRESS_CONFIG

const md = await createMarkdownRenderer(
  config.srcDir,
  config.markdown,
  config.site.base,
  config.logger
)

export default {
  watch: ['../reference/injects/*.md'],
  load (files) {
    return Object.fromEntries(
      files.flatMap(file => {
        const path = file.slice(4, -3)
        const env = {}
        md.render(fs.readFileSync(file, 'utf8'), env)
        return env.headers
          .filter(({ level }) => level === 2)
          .map(({ title, link }) => [title, path + link])
      })
    )
  }
}
