import { isValidDate } from "./dateUtils"

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
  }
})
