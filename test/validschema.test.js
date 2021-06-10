'use strict'

const test = require('ava')
const { schema } = require('../')
const fixtures = require('./fixtures')

test.beforeEach(t => {
  t.context.sch = fixtures.schema()
  t.context.data = fixtures.data()

  t.context.schema = schema(t.context.sch)
})

test('Validate undefined data', t => {
  const { data, sch } = t.context

  delete data.age

  const validData = schema(sch).validate(data)

  t.is(typeof validData, 'object')
  t.is(typeof validData.age, 'undefined')
})

test('Error: Invalid type', t => {
  const { data, sch } = t.context

  sch.name.type = 'invalidType'

  const error = t.throws(() => schema(sch).validate(data))

  t.regex(error.message, /Invalid type/)
})

test('Validate data strict value', t => {
  const { data, sch } = t.context

  data.role = 'administrator'

  const { value } = schema(sch).validate(data)

  t.deepEqual(value.role, 'guest')
})

test('Error invalid data and schema', t => {
  const { data, sch } = t.context

  let error = t.throws(() => {
    return schema(sch).validate('', schema)
  })

  t.regex(error.message, /Parameters data and schema must be objects/)

  error = t.throws(() => {
    return schema().validate(data)
  })

  t.regex(error.message, /Invalid schema/)

  error = t.throws(() => {
    return schema(sch).validate(undefined, {})
  })

  t.regex(error.message, /Parameters data and schema must be objects/)
})

test('Validate data type boolean', t => {
  const { data, sch } = t.context

  const { value } = schema(sch).validate(data)

  t.deepEqual(value.accept, data.accept)

  data.accept = 'invalidBoolean'

  const { error } = schema(sch).validate(data)

  t.regex(error.message, /must be a boolean/)
})

test('Validate data options with default value', t => {
  const { data, sch } = t.context

  delete data.profession

  const { value } = schema(sch).validate(data)

  t.deepEqual(value.profession, sch.profession.default)
})

test('Error, Invalid value from options', t => {
  const { data, sch } = t.context

  const { error } = schema(sch).validate({
    ...data,
    genere: 'Invalid genere'
  })

  t.regex(error.message, /must be one of/)
})

test('Correct options value', t => {
  const { data, sch } = t.context
  const genere = 'female'
  const { error, value } = schema(sch).validate({
    ...data,
    genere: 'female'
  })

  t.deepEqual(value.genere, genere)
  t.falsy(error)
})

test('Validating object data', t => {
  const { data, sch } = t.context

  const { error, value } = schema(sch).validate(data)

  t.deepEqual(typeof value.skills, 'object', 'message')
  t.falsy(error)
})

test('Error in object value', t => {
  const { data, sch } = t.context

  const { error } = schema(sch).validate({
    ...data,
    skills: 'php, node'
  })

  t.truthy(error)
  t.regex(error.message, /must be of type object/)
})

test('Validating array value', t => {
  const { data, sch } = t.context

  const { error, value } = schema(sch).validate(data, schema)

  t.falsy(error)
  t.true(Array.isArray(value.languages))
})

test('Error in array value', t => {
  const { data, sch } = t.context

  const { error } = schema(sch).validate({
    ...data,
    languages: 'php, node'
  })

  t.truthy(error)
  t.regex(error.message, /must be an array/)
})

test('Validating default single data', t => {
  const { data, sch } = t.context

  const { value } = schema(sch).validate(data, schema)

  t.deepEqual(value.name, data.name)
  t.deepEqual(value.city, sch.city.default)
})

test('Validating number value', t => {
  const { data, schema } = t.context

  const { value } = schema.validate(data)
  const { error } = schema.validate({
    ...data,
    age: 'Name'
  })

  t.deepEqual(value.age, data.age)
  t.regex(error.message, /"age" must be a number/)
})

test('Validating string value', t => {
  const { data, schema } = t.context

  const { value } = schema.validate(data)
  const { error } = schema.validate({
    ...data,
    name: 325345
  })

  t.deepEqual(value.name, data.name)
  t.deepEqual(typeof value.name, 'string')
  t.regex(error.message, /"name" must be a string/)
})

test('Validating email type', t => {
  const { data, schema } = t.context

  const { value } = schema.validate(data)
  const { error } = schema.validate({
    ...data,
    email: 'testemail.fail'
  })

  t.deepEqual(value.email, data.email)
  t.deepEqual(typeof value.email, 'string')
  t.regex(error.message, /valid email/)
})

test('Validating require value', t => {
  const { data, schema } = t.context

  delete data.email

  const { value, error } = schema.validate(data)

  t.falsy(value.email)
  t.truthy(error)
  t.regex(error.message, /is required/)
})

test('Error, extra invalid values', t => {
  const { data, schema } = t.context

  data.test = 'Lorem ipsum dolor sit amet'

  const { value, error } = schema.validate(data)

  t.deepEqual(value.test, data.test)
  t.truthy(error)
  t.regex(error.message, /is not allowed/)
})

test('Allow extra values', t => {
  const { data, schema } = t.context

  data.test = 'Lorem ipsum dolor sit amet'

  const { value, error } = schema.validate(data, {
    allowUnknown: true
  })

  t.deepEqual(value.test, data.test)
  t.falsy(error)
})

test('Validating default callback function', t => {
  const { data, schema, sch } = t.context

  const { error, value } = schema.validate(data)

  t.falsy(error)
  t.deepEqual(typeof sch.state.value, 'function')
  t.deepEqual(typeof sch.created.value, 'function')
  t.deepEqual(value.state, 'Antioquia')
  t.deepEqual(typeof value.created, 'number')
})

test('Validate child object schema', t => {
  const { data, schema } = t.context

  const { error, value } = schema.validate(data, schema)

  t.falsy(error)
  t.deepEqual(typeof value.properties, 'object')
  t.deepEqual(value.properties.weight, data.properties.weight)
  t.deepEqual(value.properties.skinColor, data.properties.skinColor)
})

test('Error, Child object schema', t => {
  const { data, schema } = t.context

  const height = '175 kg'
  const { error, value } = schema.validate({
    ...data,
    properties: {
      ...data.properties,
      height
    }
  })

  t.truthy(error)
  t.deepEqual(typeof value.properties, 'object')
  t.deepEqual(value.properties.height, height)
  t.regex(error.message, /must be a number/)
})
