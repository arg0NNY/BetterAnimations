import { z } from 'zod'
import { InjectSchema } from '@animation/schemas/utils'
import Inject from '@shared/enums/Inject'
import Setting from '@shared/enums/AnimationSetting'
import { DurationSchema } from '@animation/schemas/SettingsSchema'
import EasingSchema from '@animation/schemas/EasingSchema'
import { AccordionType, getMarginProperty, getSizeProperty } from '@shared/utils/accordion'
import ModuleKey from '@shared/enums/ModuleKey'
import AnimationType from '@shared/enums/AnimationType'

function getVariableName (type, name) {
  return `__accordion_${type}__${name}`
}

function getDefaultType (module, type) {
  switch (module.id) {
    case ModuleKey.Messages:
      return type === AnimationType.Enter ? AccordionType.MarginBottom : null
    case ModuleKey.MembersSidebar:
    case ModuleKey.ThreadSidebar:
      return AccordionType.MarginRight
    default: return null
  }
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
        "ease": {
          "inject": "easing",
          "easing": easing
        },
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

export const AccordionInjectSchema = ({ module, type, settings, duration, easing }) => InjectSchema(Inject.Accordion).extend({
  type: z.union([
    z.enum(AccordionType.values()),
    z.null()
  ]).optional()
    .default(getDefaultType(module, type)),
  duration: Setting.Duration in settings
    ? DurationSchema().optional().default(duration)
    : DurationSchema(),
  easing: Setting.Easing in settings
    ? EasingSchema.optional().default(easing)
    : EasingSchema
}).transform(
  ({ type, duration, easing }) => type ? buildAccordion(type, { duration, easing }) : null
)
