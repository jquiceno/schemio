'use strict'

const Joi = require('@hapi/joi')

const goblaTypes = ['string', 'number', 'email', 'array', 'object', 'boolean']

class Schema {
  constructor (schema) {
    if (!schema) throw new Error('Invalid schema')
    this.objSchema = schema
    this.schema = this.create(schema)
  }

  clear (objData) {
    const newObjData = {}

    Object.keys(this.objSchema).forEach(key => {
      newObjData[key] = objData[key]
    })

    return newObjData
  }

  validate (data, { allowUnknown = false, clear = false } = {}) {
    if (!data || Schema.isType('object', data).error || Schema.isType('object', this.objSchema).error) {
      throw new Error('Parameters data and schema must be objects')
    }

    data = !clear ? data : this.clear(data)

    data = this.setValues(data, this.objSchema)

    const validate = this.schema.validate(data, {
      allowUnknown
    })

    return validate
  }

  static isType (types, value) {
    const schema = []

    if (!Array.isArray(types)) {
      types = [types]
    }

    const validTypes = {
      string: Joi.string(),
      number: Joi.number(),
      email: Joi.string().email(),
      array: Joi.array(),
      object: Joi.object(),
      boolean: Joi.boolean()
    }

    types.forEach(t => {
      if (validTypes[t.toLowerCase()]) {
        schema.push(validTypes[t])
      }
    })

    if (!schema.length) {
      return {
        error: {
          code: 'ERR_ASSERTION',
          message: 'The type of data does not exist or is invalid'
        }
      }
    }

    return Joi.object({ value: schema }).validate({ value })
  }

  setValues (data, schema) {
    Object.keys(schema).forEach(key => {
      if (!schema[key].value) return

      if (typeof schema[key].value === 'function') {
        data[key] = schema[key].value({ value: data[key], data })
        return
      }

      data[key] = schema[key].value
    })

    return data
  }

  createTypes (objectSchema) {
    const { type, schema } = objectSchema

    if (!type) return Joi.any()

    if (type === 'email') return Joi.string().email()

    if (type === 'object' && schema) {
      return this.create(schema)
    }

    if (goblaTypes.includes(objectSchema.type)) {
      return Joi[objectSchema.type]()
    }

    throw new Error(`Invalid type ${type}`)
  }

  create (objectSchema) {
    const newSchema = {}

    Object.keys(objectSchema).forEach(key => {
      const element = objectSchema[key]
      let schemaField = this.createTypes(element)

      if (element.default) {
        schemaField = schemaField.default(element.default)
      }

      if (element.opts) {
        schemaField = schemaField.valid(...element.opts)
      }

      if (element.required) {
        schemaField = schemaField.required()
      }

      newSchema[key] = schemaField
    })

    return Joi.object(newSchema)
  }
}

module.exports = {
  Schema,
  schema: (schema) => new Schema(schema)
}
