import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import banner from 'vite-plugin-banner'
import omit from 'lodash-es/omit'
import { version } from './package.json'
import config from './config.json'
import changelog from './changelog.json'

config.version = version

function buildBannerConfig () {
  const bannerConfig = {
    info: {
      name: config.name,
      version,
      description: config.description
    }
  }
  if (changelog[version]?.changes) bannerConfig.changelog = changelog[version].changes
  return bannerConfig
}

const bannerContent = `/**
${Object.keys(config).map(key => ` * @${key} ${config[key]}`).join('\n')}
 */

/* ### CONFIG START ### */
const config = ${JSON.stringify(buildBannerConfig(), null, 2)}
/* ### CONFIG END ### */
`

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
      const outputFile = path.join(__dirname, 'dist', `${config.name}.plugin.js`)
      if (!fs.existsSync(path.join(bdFolder, 'plugins')))
        fs.mkdirSync(path.join(bdFolder, 'plugins'), { recursive: true })

      if (!fs.existsSync(outputFile)) return

      fs.copyFileSync(outputFile, path.join(bdFolder, 'plugins', `${config.name}.plugin.js`))
      console.log('\x1b[32m%s\x1b[34m%s\x1b[32m%s\x1b[0m', '✓ copied to ', 'BetterDiscord', ' folder')
    }
  }
}

export const aliases = {
  '@package': path.resolve(__dirname, 'package.json'),
  '@config': path.resolve(__dirname, 'config.json'),
  '@changelog': path.resolve(__dirname, 'changelog.json'),
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
      name: config.name,
      fileName: () => `${config.name}.plugin.js`,
      formats: ['iife']
    },
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'classnames', 'fs', 'path', 'events'],
      output: {
        globals: {
          react: 'BdApi.React',
          'react-dom': 'BdApi.ReactDOM',
          classnames: 'BdApi.Utils.className',
          fs: 'require("fs")',
          path: 'require("path")',
          events: 'require("events")'
        }
      },
      onwarn (warning, warn) {
        if (warning.code === 'MISSING_NODE_BUILTINS') return
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
      '@error/manager': path.resolve(__dirname, 'src/error/manager'),
      '@error/boundary': path.resolve(__dirname, 'src/error/boundary'),

      // General
      ...omit(aliases, ['@discord', '@style'])
    }
  },
  plugins: [
    banner(bannerContent),
    copyToBDPlugin()
  ],
  esbuild: {
    jsxFactory: 'BdApi.React.createElement',
    jsxFragment: 'BdApi.React.Fragment'
  }
})
