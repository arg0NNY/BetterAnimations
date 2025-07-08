import patchEmoji from '@/patches/optimizations/patchEmoji'
import patchProfileEffects from '@/patches/optimizations/patchProfileEffects'
import patchUseIsVisible from '@/patches/optimizations/patchUseIsVisible'
import patchGenerateUserSettingsSections from '@/patches/optimizations/patchGenerateUserSettingsSections'
import patchEmitter from '@/patches/optimizations/patchEmitter'

export function applyOptimizationPatches () {
  patchEmoji()
  patchProfileEffects()
  patchUseIsVisible()
  patchGenerateUserSettingsSections()
  patchEmitter()
}
