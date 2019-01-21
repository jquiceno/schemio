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
            throw Boom.badRequest(`The fiel ${key} is required`)
          }
        }

        if (item.default && !data[key]) {
          newData[key] = schema[key].default
          delete data[key]

          return
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

        if (item.type && types.indexOf(item.type) >= 0) {
          if (item.type === 'string') {
            valid = Joi.validate(data[key], Joi.string())
          } else if (item.type === 'number') {
            valid = Joi.validate(data[key], Joi.number())
          } else if (item.type === 'email') {
            valid = Joi.validate(data[key], Joi.string().email())
          } else if (item.type === 'array') {
            valid = Joi.validate(data[key], Joi.array())
          } else if (item.type === 'object') {
            valid = Joi.validate(data[key], Joi.object())
          }

          if (valid.error) {
            throw Boom.badRequest(`Error, the ${key} field must be a ${item.type}`)
          }
        }

        if (data[key]) {
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
}

module.exports = Schema
