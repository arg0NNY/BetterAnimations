const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const pluginConfig = require('./src/config.json')
pluginConfig.version = pkg.version

const meta = (() => {
  const lines = ['/**']
  for (const key in pluginConfig) {
    lines.push(` * @${key} ${pluginConfig[key]}`)
  }
  lines.push(' */')
  return lines.join('\n')
})()

module.exports = {
  mode: 'development',
  target: 'node',
  devtool: false,
  entry: './src/index.js',
  output: {
    filename: `${pluginConfig.name}.plugin.js`,
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
    compareBeforeEmit: false
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'raw-loader' },
      { test: /\.jsx$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ raw: true, banner: meta }),
    {
      apply: (compiler) => {
        compiler.hooks.assetEmitted.tap(pluginConfig.name, (filename, info) => {
          const userConfig = (() => {
            if (process.platform === 'win32') return process.env.APPDATA
            if (process.platform === 'darwin') return path.join(process.env.HOME, 'Library', 'Application Support')
            if (process.env.XDG_CONFIG_HOME) return process.env.XDG_CONFIG_HOME
            return path.join(process.env.HOME, 'Library', '.config')
          })()
          const bdFolder = path.join(userConfig, 'BetterDiscord')
          fs.copyFileSync(info.targetPath, path.join(bdFolder, 'plugins', filename))
          console.log(`\n✅ Copied to BD folder`)
        })
      }
    }
  ]
}
