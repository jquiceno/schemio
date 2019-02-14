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
      }
    }
  },

  data () {
    return {
      name: 'John Quiceno',
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
