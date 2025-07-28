import { BDData } from '@/BdApi'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import useUpdate from '@/hooks/useUpdate'
import { useCallback, useEffect } from 'react'
import SettingsMode from '@enums/SettingsMode'

class DataField {
  constructor (name, defaultValue) {
    this.$name = name
    this.$defaultValue = defaultValue
    this.$parentField = null
  }

  $load () {
    if (this.$parentField) return this.$parentField.$reflect('get', this.$name)

    return BDData.load(this.$name)
  }
  $save (value) {
    if (this.$parentField) return this.$parentField.$mutationReflect('set', this.$name, value)

    BDData.save(this.$name, structuredClone(value))
    Emitter.emit(Events.DataFieldUpdated, this.$name)
  }

  get $value () {
    return this.$load() ?? this.$defaultValue
  }
  set $value (value) {
    this.$save(value)
  }
}

class DataObjectField extends DataField {
  static mutationMethods = []

  constructor (name, fields = [], defaultValue = {}) {
    super(name, defaultValue)

    this.$fields = Object.fromEntries(
      fields.map(field => {
        field.$parentField = this
        return [field.$name, field]
      })
    )

    const reflect = method => (self, ...args) => this.$reflect.call(self, method, ...args)
    const mutationReflect = method => (self, ...args) => this.$mutationReflect.call(self, method, ...args)

    return new Proxy(this, {
      get (self, key) {
        if (key in self) return self[key]

        if (key in self.$fields) {
          if (self.$fields[key] instanceof DataObjectField) return self.$fields[key]
          return self.$fields[key].$value
        }

        const value = self.$value[key]

        if (typeof value === 'function') return (...args) => {
          const value = self.$value
          const returnValue = value[key](...args)
          if (self.constructor.mutationMethods.includes(key)) self.$value = value
          return returnValue
        }
        return value
      },
      set (self, key, value) {
        if (key in self) self[key] = value
        else if (key in self.$fields) self.$fields[key].$value = value
        else self.$mutationReflect('set', key, value)
        return true
      },
      defineProperty: mutationReflect('defineProperty'),
      deleteProperty: mutationReflect('deleteProperty'),
      has: reflect('has'),
      ownKeys: reflect('ownKeys'),
      getOwnPropertyDescriptor: reflect('getOwnPropertyDescriptor')
    })
  }

  $reflect (method, ...args) {
    return Reflect[method](this.$value, ...args)
  }
  $mutationReflect (method, ...args) {
    const value = this.$value
    Reflect[method](value, ...args)
    this.$value = value
    return true
  }
}

class DataArrayField extends DataObjectField {
  static mutationMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

  constructor (name, defaultValue = []) {
    return super(name, [], defaultValue)
  }
}

class DataSetField extends DataArrayField {
  static mutationMethods = ['add', 'delete', 'clear']

  constructor (name, defaultValue = new Set()) {
    return super(name, Array.from(defaultValue))
  }

  get $value () {
    return new Set(super.$value)
  }
  set $value (value) {
    super.$value = Array.from(value)
  }
}

class Data {
  constructor (fields = []) {
    this.$fields = Object.fromEntries(
      fields.map(field => [field.$name, field])
    )

    return new Proxy(this, {
      get (self, key) {
        if (key in self) return self[key]

        if (!(key in self.$fields)) self.$createField(key)
        if (self.$fields[key] instanceof DataObjectField) return self.$fields[key]
        return self.$fields[key].$value
      },
      set (self, key, value) {
        if (key in self.$fields) self.$fields[key].$value = value
        else self.$createField(key).$value = value
        return true
      }
    })
  }

  $createField (name, defaultValue) {
    return this.$fields[name] = new DataField(name, defaultValue)
  }
}

const data = new Data([
  new DataField('configVersion'),
  new DataField('packs'),
  new DataObjectField('prompts'),
  new DataObjectField('dismissibles'),
  new DataField('settings'),
  new DataField('settingsMode', SettingsMode.Simple),
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
  new DataObjectField('preferences', [
    new DataField('module'),
    new DataField('pack'),
    new DataField('sort')
  ])
])

export function useData (fieldName) {
  const update = useUpdate()

  useEffect(() => {
    const onDataFieldUpdated = name => {
      if (name === fieldName) update()
    }
    Emitter.on(Events.DataFieldUpdated, onDataFieldUpdated)
    return () => Emitter.off(Events.DataFieldUpdated, onDataFieldUpdated)
  }, [fieldName])

  return [
    data[fieldName],
    useCallback(value => data[fieldName] = value, [fieldName])
  ]
}

export default data
