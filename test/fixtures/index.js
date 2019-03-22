'use strict'

import Moment from 'moment'

module.exports = {
  schema () {
    return {
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
      idioms: {
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
          }
        }
      },
      role: {
        type: 'string',
        value: 'guest'
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
      idioms: ['English', 'Spanish', 'Italian'],
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
