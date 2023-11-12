
const injects = [
  {
    type: 'node',
    allowedInside: ['anime'],
    parse (params, { node }) {
      if (params.querySelectorAll) return node.querySelectorAll(params.querySelectorAll)
      if (params.querySelector) return node.querySelector(params.querySelector)
      return node
    }
  },
  {
    type: 'anime.stagger',
    allowedInside: ['anime'],
    parse (params) {

    }
  }
]
