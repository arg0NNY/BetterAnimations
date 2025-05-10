import { groupedInjectSchemas } from '@/modules/animation/schemas/InjectableSchema'

export default new class Documentation {
  Definition = {
    Pack: 'pack',
    Animation: 'animation',
    Meta: 'meta',
    Settings: 'settings',
    Animate: 'animate',
    Anime: 'anime',
    Snippet: 'snippet',
    Easing: 'easing'
  }

  get baseUrl () { return import.meta.env.VITE_DOCS_BASE_URL }
  get referenceBaseUrl () { return `${this.baseUrl}/reference` }
  get injectsBaseUrl () { return `${this.referenceBaseUrl}/injects` }

  get homeUrl () { return this.baseUrl }
  get usageUrl () { return `${this.baseUrl}/usage/basics` }
  get createUrl () { return `${this.baseUrl}/create/introduction` }

  get enhanceLayoutUrl () { return `${this.baseUrl}/usage/modules#enhance-layout` }

  getDefinitionUrl (definition) {
    return `${this.referenceBaseUrl}/${definition.toLowerCase()}`
  }

  getInjectGroup (inject) {
    return Object.keys(groupedInjectSchemas)
      .find(group => inject in groupedInjectSchemas[group] && group !== 'operators')
  }
  getInjectAnchor (inject) {
    return inject.match(/[a-zA-Z0-9]+/g).join('-').toLowerCase()
  }
  getInjectUrl (inject) {
    const group = this.getInjectGroup(inject)
    if (!group) return

    return `${this.injectsBaseUrl}/${group}#${this.getInjectAnchor(inject)}`
  }
}
