'use strict'

const Moment = require('moment')

module.exports = {
  schema () {
    return {
      name: {
        type: 'string',
        require: true
      },
      email: {
        type: 'email',
        required: true
      },
      age: {
        type: 'number'
      },
      city: {
        default: 'Medellin'
      },
      state: {
        value: (value, data) => {
          return 'Antioquia'
        }
      },
      created: {
        value: (value, data) => {
          return Moment().unix()
        }
      },
      languages: {
        type: 'array'
      },
      skills: {
        type: 'object'
      },
      genere: {
        type: 'string',
        opts: ['male', 'female']
      },
      profession: {
        type: 'string',
        opts: ['backEnd', 'frontEnd'],
        default: 'backEnd'
      },
      accept: {
        type: 'boolean'
      },
      properties: {
        type: 'object',
        schema: {
          height: {
            type: 'number'
          },
          eyeColor: {
            type: 'string'
          },
          weight: {
            type: 'string'
          },
          skinColor: {
            type: 'string'
          }
        }
      },
      role: {
        type: 'string',
        value: 'guest'
      },
      country: {
        type: 'string'
      }
    }
  },

  data () {
    return {
      properties: {
        height: 175,
        eyeColor: 'Green',
        weight: '85 Kg',
        skinColor: 'black'
      },
      name: 'John Quiceno',
      accept: true,
      country: 'Colombia',
      email: 'test@gmail.com',
      age: 29,
      languages: ['English', 'Spanish', 'Italian'],
      genere: 'male',
      skills: {
        php: true,
        nodejs: true,
        go: true,
        python: true
      },
      profession: 'backEnd'
    }
  }
}
