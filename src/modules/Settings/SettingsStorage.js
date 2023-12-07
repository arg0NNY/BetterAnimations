import Data from '@/modules/Data'
import deepmerge from 'deepmerge'

const defaults = {

}

export let settings = load()

function load (defaults) {
  return deepmerge(defaults, Data.settings)
}

function save (value) {
  Data.settings = value
}

export default {
  settings,
  load,
  save
}
