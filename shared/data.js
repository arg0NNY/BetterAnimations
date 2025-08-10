import { useCallback, useEffect } from 'react'
import EventEmitter from 'events'
import useUpdate from '@shared/hooks/useUpdate'

export const DataEvents = {
  FieldUpdated: 'fieldUpdated'
}

export class DataField {
  constructor (name, defaultValue) {
    this.$name = name
    this.$defaultValue = defaultValue
    this.$parentField = null
    this.$base = null
    this.$emitter = null
  }

  $load () {
    if (this.$parentField) return this.$parentField.$reflect('get', this.$name)

    if (!this.$base) throw new Error('Trying to manipulate root DataField before $base was assigned')
    return this.$base.load(this.$name)
  }
  $save (value) {
    if (this.$parentField) return this.$parentField.$mutationReflect('set', this.$name, value)

    if (!this.$base) throw new Error('Trying to manipulate root DataField before $base was assigned')
    this.$base.save(this.$name, structuredClone(value))
    this.$emitter?.emit(DataEvents.FieldUpdated, this.$name)
  }

  get $value () {
    return this.$load() ?? this.$defaultValue
  }
  set $value (value) {
    this.$save(value)
  }
}

export class DataObjectField extends DataField {
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

export class DataArrayField extends DataObjectField {
  static mutationMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

  constructor (name, defaultValue = []) {
    return super(name, [], defaultValue)
  }
}

export class DataSetField extends DataArrayField {
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
  constructor (base, fields = []) {
    this.$base = base
    this.$emitter = new EventEmitter

    this.$fields = Object.fromEntries(
      fields.map(field => {
        field.$base = this.$base
        field.$emitter = this.$emitter
        return [field.$name, field]
      })
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
    const field = new DataField(name, defaultValue)
    field.$base = this.$base
    this.$fields[name] = field
    return field
  }

  $use (name) {
    const update = useUpdate()

    useEffect(() => {
      const onDataFieldUpdated = updatedName => {
        if (updatedName === name) update()
      }
      this.$emitter.on(DataEvents.FieldUpdated, onDataFieldUpdated)
      return () => this.$emitter.off(DataEvents.FieldUpdated, onDataFieldUpdated)
    }, [name])

    return [
      this[name],
      useCallback(value => this[name] = value, [name])
    ]
  }
}

export default Data
