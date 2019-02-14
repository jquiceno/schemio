'use strict'

import test from 'ava'
import { Schema } from '../src'
import fixtures from './fixtures'

test.beforeEach(t => {
  t.context.schema = fixtures.schema()
  t.context.data = fixtures.data()
})

test('Validate data options with default value', t => {
  const data = t.context.data
  const schema = t.context.schema

  data.profession = 'TestProfession'

  let validData = Schema.validate(data, schema)

  t.true(validData.profession === schema.profession.default)
})

test('Validate single options values', t => {
  const data = t.context.data

  const schema = t.context.schema

  let validData = Schema.validate(data, schema)

  t.deepEqual(validData.genere, data.genere)

  data.genere = 'Test'

  validData = Schema.validate(data, schema)

  t.true(typeof validData.genere === 'undefined')

  data.genere = 'female'

  validData = Schema.validate(data, schema)

  t.deepEqual(validData.genere, data.genere)
})

test('Validating object data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  const errData = t.throws(() => {
    data.skills = 'php, node'
    return Schema.validate(data, schema)
  })

  t.is(typeof validData.skills, 'object')
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /Error, the skills field must be a object/)
})

test('Validating array data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  const errData = t.throws(() => {
    data.idioms = {
      English: true
    }
    return Schema.validate(data, schema)
  })

  t.is(Array.isArray(validData.idioms), true)
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /Error, the idioms field must be a array/)
})

test('Validating default callback function', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  t.deepEqual(validData.name, data.name)
  t.deepEqual(validData.state, 'Antioquia')
  t.is(typeof validData.created, 'number')
})

test('Validating default single data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  t.deepEqual(validData.name, data.name)
  t.deepEqual(validData.city, schema.city.default)
})

test('Validating number data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  const errData = t.throws(() => {
    data.age = 'test age string'
    return Schema.validate(data, schema)
  })

  t.deepEqual(validData.name, data.name)
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /Error, the age field must be a number/)
})

test('Validating string data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  const errData = t.throws(() => {
    data.name = 465
    return Schema.validate(data, schema)
  })

  t.deepEqual(validData.email, data.email)
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /Error, the name field must be a string/)
})

test('Validating email data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)

  const errData = t.throws(() => {
    data.email = 'testemail.fail'
    return Schema.validate(data, schema)
  })

  t.deepEqual(validData.name, data.name)
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /Error, the email field must be a email/)
})

test('Validating require data', t => {
  const data = t.context.data
  const schema = t.context.schema

  const validData = Schema.validate(data, schema)
  const errData = t.throws(() => {
    delete data.email
    return Schema.validate(data, schema)
  })

  t.deepEqual(validData.name, data.name)
  t.deepEqual(errData.output.statusCode, 400)
  t.regex(errData.output.payload.message, /The field email is required/)
})

test('Validating data no clear', t => {
  const data = t.context.data
  const schema = t.context.schema
  data.test = 'Lorem ipsum dolor sit amet'

  const validData = Schema.validate(data, schema, {
    clear: false
  })

  t.deepEqual(validData.name, data.name)
  t.deepEqual(validData.country, data.country)
})
