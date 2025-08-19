import { BDData } from '@/BdApi'
import SettingsMode from '@enums/SettingsMode'
import { version } from '@package'
import Data, { DataField, DataObjectField, DataSetField } from '@data'

const data = new Data(BDData, [
  new DataObjectField('currentVersionInfo', [
    new DataField('version', version),
    new DataField('hasShownChangelog', false)
  ]),
  new DataField('configVersion'),
  new DataField('settings'),
  new DataField('settingsMode', SettingsMode.Simple),
  new DataObjectField('packs'),
  new DataObjectField('preferences', [
    new DataField('module'),
    new DataField('pack'),
    new DataField('sort')
  ]),
  new DataObjectField('catalog', [
    new DataField('visited', false),
    new DataSetField('known'),
    new DataField('cache'),
    new DataField('sort')
  ]),
  new DataObjectField('library', [
    new DataSetField('whitelist'),
    new DataField('sort')
  ]),
  new DataObjectField('prompts'),
  new DataObjectField('dismissibles')
])

export const useData = data.$use.bind(data)

export default data
