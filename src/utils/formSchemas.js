import { isValidDate } from './dateUtils'
import { isUUIDv4 } from './uuidValidator'

export const validationSchemas = (updating) => Object({
  habitForm: {
    name: {
      isMandatory: !updating,
      validations: [
        (value) => typeof value == 'string',
        (value) => value.length > 0 && value.length <= 30,
      ],
    },
    createdAt: {
      isMandatory: false,
      validations: [
        (value) => typeof value == 'string',
        (value) => isValidDate(value),
      ],
    },
  },
  recordForm: {
    habitID: {
      mandatory: !updating,
      validations: [
        (value) => typeof value == 'string',
        (value) => isUUIDv4(value),
      ],
    },
    note: {
      mandatory: false,
      validations: [
        (value) => value == null || typeof value == 'string',
        (value) => value == null || (value.length >= 0 && value.length <= 2000),
      ],
    },
    date: {
      mandatory: !updating,
      validations: [
        (value) => typeof value == 'string',
        (value) => isValidDate(value),
      ],
    },
  },
  emailForm: {
    email: {
      isMandatory: true,
      validations: [
        (value) => typeof value == 'string',
        (value) => {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return regex.test(value)
        },
      ]
    },
  },
})
