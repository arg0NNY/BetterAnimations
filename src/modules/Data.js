import { BDData } from '@/BdApi'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import useUpdate from '@/hooks/useUpdate'
import { useCallback, useEffect } from 'react'
import SettingsMode from '@enums/SettingsMode'

class DataField {
  constructor (name, defaultValue) {
    this.name = name
    this.defaultValue = defaultValue
  }

  $load () {
    return BDData.load(this.name)
  }
  $save (value) {
    BDData.save(this.name, structuredClone(value))
    Emitter.emit(Events.DataFieldUpdated, this.name)
  }

  get $value () {
    return this.$load() ?? this.defaultValue
  }
  set $value (value) {
    this.$save(value)
  }
}

class DataObjectField extends DataField {
  static mutationMethods = []

  constructor (name, defaultValue = {}) {
    super(name, defaultValue)

    const reflect = method => (self, ...args) => {
      return Reflect[method](self.$value, ...args)
    }
    const mutationReflect = method => (self, ...args) => {
      const value = self.$value
      Reflect[method](value, ...args)
      self.$value = value
      return true
    }

    return new Proxy(this, {
      get (self, key) {
        if (key in self) return self[key]

        const value = self.$value[key]

        if (typeof value === 'function') return (...args) => {
          const value = self.$value
          const returnValue = value[key](...args)
          if (self.constructor.mutationMethods.includes(key)) self.$value = value
          return returnValue
        }
        return value
      },
      set: mutationReflect('set'),
      defineProperty: mutationReflect('defineProperty'),
      deleteProperty: mutationReflect('deleteProperty'),
      has: reflect('has'),
      ownKeys: reflect('ownKeys'),
      getOwnPropertyDescriptor: reflect('getOwnPropertyDescriptor')
    })
  }
}

class DataArrayField extends DataObjectField {
  static mutationMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

  constructor (name, defaultValue = []) {
    return super(name, defaultValue)
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

const Data = new class Data {
  constructor () {
    this.$fields = {
      configVersion: new DataField('configVersion'),
      packs: new DataField('packs'),
      prompts: new DataObjectField('prompts'),
      dismissibles: new DataObjectField('dismissibles'),
      settings: new DataField('settings'),
      settingsMode: new DataField('settingsMode', SettingsMode.Simple),
      whitelist: new DataSetField('whitelist'),
      catalog: new DataObjectField('catalog'),
      library: new DataObjectField('library')
    }

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
    Data[fieldName],
    useCallback(value => Data[fieldName] = value, [fieldName])
  ]
}

export default Data
