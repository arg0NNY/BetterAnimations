import DiscordClasses from '@discord/classes'

const DiscordSelectors = new Proxy(DiscordClasses, {
  get (obj, prop) {
    const module = obj[prop]
    return module && new Proxy({}, {
      get (_, prop) {
        return module[prop]?.split(' ').filter(i => !!i).map(c => '.'+c).join('')
      }
    })
  }
})

export default DiscordSelectors
