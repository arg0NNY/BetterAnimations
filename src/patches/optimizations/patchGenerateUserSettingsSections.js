import Patcher from '@/modules/Patcher'
import { generateUserSettingsSectionsKeyed } from '@discord/modules'
import Config from '@/modules/Config'

async function patchGenerateUserSettingsSections () {
  const cached = {
    params: null,
    value: null
  }
  Patcher.instead(...await generateUserSettingsSectionsKeyed, (self, [params], original) => {
    if (!Config.current.general.cacheUserSettingsSections) return original(params)

    if (!cached.params || Object.keys(params).some(k => params[k] !== cached.params[k])) {
      cached.params = params
      cached.value = original(params)
    }

    return cached.value
  })
}

export default patchGenerateUserSettingsSections
