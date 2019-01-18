'use strict'

import test from 'ava'
import { Schema } from '../src'

test.beforeEach(t => {
  t.context.schema = {
    name: {
      type: 'string',
      require: true
    },
    email: {
      type: 'email',
      require: true
    },
    age: {
      type: 'number'
    }
  }

  t.context.data = {
    name: 'John Quiceno',
    country: 'Colombia',
    email: 'test@gmail.com',
    age: 29
  }
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
  t.regex(errData.output.payload.message, /The fiel email is required/)
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
