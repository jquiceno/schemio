'use strict'

const test = require('ava')
const { Schema } = require('../src')

test('Valid multiple types', t => {
  let validData = Schema.isType(['string', 'number'], '2')
  t.is(validData.error, null)

  validData = Schema.isType('boolean', false)
  t.is(validData.error, null)

  validData = Schema.isType('dsdf', false)
  t.regex(validData.error.message, /The type of data does not exist or is invalid/)
})
