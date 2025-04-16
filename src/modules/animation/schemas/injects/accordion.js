import { z } from 'zod'
import { InjectSchema } from '@/modules/animation/schemas/utils'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import { DurationSchema } from '@/modules/animation/schemas/SettingsSchema'
import EasingSchema from '@/modules/animation/schemas/EasingSchema'
import { toAnimeEasing } from '@/utils/easings'
import { AccordionType, getMarginProperty, getSizeProperty } from '@/utils/accordion'

function getVariableName (type, name) {
  return `__accordion_${type}__${name}`
}

function buildAccordion (type, { duration, easing }) {
  const variableName = getVariableName(type, 'value')
  return {
    "onBeforeCreate": {
      "inject": "var.set",
      "name": variableName,
      "value": {
        "inject": "*",
        "a": -1,
        "b": {
          "inject": "+",
          "a": {
            "inject": "utils.get",
            "target": { "inject": "element" },
            "property": getSizeProperty(type),
            "unit": false
          },
          "b": {
            "inject": "utils.get",
            "target": { "inject": "container" },
            "property": getMarginProperty(type, true),
            "unit": false
          }
        }
      }
    },
    "anime": {
      "targets": { "inject": "container" },
      "parameters": {
        "duration": duration,
        "ease": toAnimeEasing(easing),
        [getMarginProperty(type)]: {
          "inject": "type",
          "enter": {
            "inject": "isIntersected",
            "true": 0,
            "false": {
              "from": {
                "inject": "var.get",
                "name": variableName
              }
            }
          },
          "exit": {
            "inject": "var.get",
            "name": variableName
          }
        }
      }
    }
  }
}

export const AccordionInjectSchema = ({ settings, duration, easing }) => InjectSchema(Inject.Accordion).extend({
  type: z.enum(AccordionType.values()),
  duration: Setting.Duration in settings
    ? DurationSchema().optional().default(duration)
    : DurationSchema(),
  easing: Setting.Easing in settings
    ? EasingSchema.optional().default(easing)
    : EasingSchema
}).transform(
  ({ type, duration, easing }) => buildAccordion(type, { duration, easing })
)
