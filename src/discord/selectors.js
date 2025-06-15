import DiscordClasses from '@discord/classes'

const DiscordSelectors = new Proxy(DiscordClasses, {
  get (obj, prop) {
    return obj[prop] && new Proxy(obj[prop], {
      get (obj, prop) {
        return obj[prop]?.split(' ').filter(i => !!i).map(c => '.'+c).join('')
      }
    })
  }
})

export default DiscordSelectors
