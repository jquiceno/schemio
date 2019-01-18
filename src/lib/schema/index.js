'use strict'

import Boom from 'boom'
import Joi from 'joi'
import defaults from 'defaults'

const types = ['string', 'number', 'email']

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

        if (item.require) {
          valid = Joi.validate(data[key], Joi.required())

          if (valid.error) {
            throw Boom.badRequest(`The fiel ${key} is required`)
          }
        }

        if (item.type && types.indexOf(item.type) >= 0) {
          if (item.type === 'string') {
            valid = Joi.validate(data[key], Joi.string())
          } else if (item.type === 'number') {
            valid = Joi.validate(data[key], Joi.number())
          } else if (item.type === 'email') {
            valid = Joi.validate(data[key], Joi.string().email())
          }

          if (valid.error) {
            throw Boom.badRequest(`Error, the ${key} field must be a ${item.type}`)
          }
        }

        newData[key] = data[key]
        delete data[key]
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
