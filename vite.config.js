import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import banner from 'vite-plugin-banner'
import pkg from './package.json'
import pluginConfig from './config.json'
import omit from 'lodash-es/omit'

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

export const aliases = {
  '@package': path.resolve(__dirname, 'package.json'),
  '@config': path.resolve(__dirname, 'config.json'),
  '@shared': path.resolve(__dirname, 'shared'),
  '@utils': path.resolve(__dirname, 'shared/utils'),
  '@enums': path.resolve(__dirname, 'shared/enums'),
  '@animation': path.resolve(__dirname, 'shared/animation'),
  '@error': path.resolve(__dirname, 'shared/error'),
  '@logger': path.resolve(__dirname, 'shared/logger'),
  '@data': path.resolve(__dirname, 'shared/data'),
  '@packs': path.resolve(__dirname, 'shared/packs'),
  '@components': path.resolve(__dirname, 'shared/components'),
  '@discord': path.resolve(__dirname, 'shared/discord'),
  '@style': path.resolve(__dirname, 'shared/style'),
  '@preview': path.resolve(__dirname, 'shared/preview')
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: pluginConfig.name,
      fileName: () => `${pluginConfig.name}.plugin.js`,
      formats: ['iife']
    },
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'classnames'],
      output: {
        globals: {
          react: 'BdApi.React',
          'react-dom': 'BdApi.ReactDOM',
          classnames: 'BdApi.Utils.className'
        }
      },
      onwarn (warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),

      // Rewrites
      '@discord': path.resolve(__dirname, 'src/discord'),
      '@style': path.resolve(__dirname, 'src/modules/Style'),
      '@animation/store': path.resolve(__dirname, 'src/modules/AnimationStore'),
      '@error/manager': path.resolve(__dirname, 'src/modules/ErrorManager'),

      // General
      ...omit(aliases, ['@discord', '@style'])
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
