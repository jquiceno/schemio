'use strict'

const test = require('ava')
const { Schema } = require('../')

test('Valid multiple types', t => {
  let validData = Schema.isType(['string', 'number'], '2')
  t.deepEqual(validData.error, undefined)

  validData = Schema.isType('boolean', false)
  t.deepEqual(validData.error, undefined)

  validData = Schema.isType('dsdf', false)
  t.regex(validData.error.message, /The type of data does not exist or is invalid/)
})
