'use strict'

import Boom from 'boom'
import Joi from 'joi'
import defaults from 'defaults'

const types = ['string', 'number', 'email', 'array', 'object']

class Schema {
  constructor (schema) {
    this.schema = schema
  }

  static validate (_data = null, schema = null, options = false) {
    try {
      options = defaults(options, {
        clear: true
      })

      const data = Object.assign({}, _data)

      const { clear } = options

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

          if (newData[key]) {
            return delete data[key]
          }
        }

        if (item.default && typeof data[key] === 'undefined') {
          newData[key] = schema[key].default
          delete data[key]

          return
        }

        if (item.type && types.indexOf(item.type) >= 0) {
          valid = Schema.isType(item.type, data[key])

          if (valid.error) {
            throw Boom.badRequest(`Error, the ${key} field must be a ${item.type}`)
          }
        }

        if (typeof data[key] !== 'undefined') {
          newData[key] = data[key]
          delete data[key]
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
    try {
      let valid = null

      if (type === 'string') {
        valid = Joi.validate(data, Joi.string())
      } else if (type === 'number') {
        valid = Joi.validate(data, Joi.number())
      } else if (type === 'email') {
        valid = Joi.validate(data, Joi.string().email())
      } else if (type === 'array') {
        valid = Joi.validate(data, Joi.array())
      } else if (type === 'object') {
        valid = Joi.validate(data, Joi.object())
      }

      return valid
    } catch (e) {
      throw new Boom(e)
    }
  }
}

module.exports = Schema
