import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import banner from 'vite-plugin-banner'
import pkg from './package.json'
import pluginConfig from './src/config.json'

pluginConfig.version = pkg.version

const meta = (() => {
  const lines = ['/**']
  for (const key in pluginConfig) {
    lines.push(` * @${key} ${pluginConfig[key]}`)
  }
  lines.push(' */')
  return lines.join('\n')
})()

function copyToBDPlugin() {
  return {
    name: 'copy-to-bd',
    closeBundle() {
      const userConfig = (() => {
        if (process.platform === 'win32') return process.env.APPDATA
        if (process.platform === 'darwin') return path.join(process.env.HOME, 'Library', 'Application Support')
        if (process.env.XDG_CONFIG_HOME) return process.env.XDG_CONFIG_HOME
        return path.join(process.env.HOME, '.config')
      })()
      const bdFolder = path.join(userConfig, 'BetterDiscord')
      const outputFile = path.join(__dirname, 'dist', `${pluginConfig.name}.plugin.js`)
      if (!fs.existsSync(path.join(bdFolder, 'plugins')))
        fs.mkdirSync(path.join(bdFolder, 'plugins'), { recursive: true })

      if (!fs.existsSync(outputFile)) return

      fs.copyFileSync(outputFile, path.join(bdFolder, 'plugins', `${pluginConfig.name}.plugin.js`))
      console.log('\x1b[32m%s\x1b[34m%s\x1b[32m%s\x1b[0m', '✓ copied to ', 'BetterDiscord', ' folder')
    }
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: pluginConfig.name,
      fileName: () => `${pluginConfig.name}.plugin.js`,
      formats: ['cjs']
    },
    minify: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    banner(meta),
    copyToBDPlugin()
  ],
  esbuild: {
    jsxFactory: 'BdApi.React.createElement',
    jsxFragment: 'BdApi.React.Fragment'
  }
})
