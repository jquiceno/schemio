'use strict'

import Boom from 'boom'
import Joi from 'joi'
import defaults from 'defaults'

const types = ['string', 'number', 'email', 'array', 'object', 'boolean']

class Schema {
  static validate (_data = null, schema = null, options = false) {
    try {
      if (this.isType('object', _data).error || this.isType('object', schema).error) {
        throw Boom.badRequest('Parameters data and schema must be objects')
      }

      options = defaults(options, {
        clear: true,
        parent: null
      })

      const data = Object.assign({}, _data)

      const { clear, parent } = options

      const newData = {}

      Object.keys(schema).map(key => {
        const item = schema[key]
        let valid = false

        if (item.require && (!item.default && !item.value)) {
          valid = Joi.validate(data[key], Joi.required())

          if (valid.error) {
            throw Boom.badRequest(`The field ${key} is required`)
          }
        }

        if (item.schema) {
          const params = item.params || options
          params.parent = key
          newData[key] = this.validate(data[key], item.schema, params)

          return delete data[key]
        }

        if (item.opts) {
          if (item.opts.indexOf(data[key]) > -1) {
            newData[key] = data[key]
          }

          if (!newData[key] && item.default) {
            newData[key] = item.default
          }

          return delete data[key]
        }

        if (typeof item.value !== 'undefined') {
          if (typeof item.value === 'function') {
            newData[key] = item.value(data[key], _data)
          } else {
            newData[key] = item.value
          }

          return delete data[key]
        }

        if (item.default && typeof data[key] === 'undefined') {
          newData[key] = schema[key].default

          return delete data[key]
        }

        if (item.type && types.indexOf(item.type) >= 0) {
          valid = Schema.isType(item.type, data[key])

          if (valid.error) {
            throw Boom.badRequest((!parent) ? `Error, the ${key} field must be a ${item.type}` : `Error, the ${parent}.${key} field must be a ${item.type}`)
          }
        }

        if (typeof data[key] !== 'undefined') {
          newData[key] = data[key]
          return delete data[key]
        }
      })

      if (!clear) {
        Object.assign(newData, data)
      }

      return newData
    } catch (e) {
      throw new Boom(e)
    }
  }

  static isType (type, data) {
    let valid = null

    switch (type) {
      case 'string':
        valid = Joi.validate(data, Joi.string())
        break
      case 'number':
        valid = Joi.validate(data, Joi.number())
        break
      case 'email':
        valid = Joi.validate(data, Joi.string().email())
        break
      case 'array':
        valid = Joi.validate(data, Joi.array())
        break
      case 'object':
        valid = Joi.validate(data, Joi.object())
        break
      case 'boolean':
        valid = Joi.validate(data, Joi.boolean())
        break
    }

    return valid
  }
}

module.exports = Schema
