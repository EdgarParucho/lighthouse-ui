import { validationSchemas } from "./formSchemas"

export function validateForm({ formName, formData, updating = false }) {
  const validationSchema = validationSchemas(updating)[formName]
  const containsUnexpectedKey = Object.keys(formData)
    .some(key => validationSchema[key] == undefined)

  const missesMandatoryKey = Object.keys(validationSchema)
    .some((key) => validationSchema[key].isMandatory && !formData[key])

  const failsValueValidation = Object.keys(validationSchema)
    .some((key) => validationSchema[key].validations
      .some((validation) => !validation(formData[key]))
    )
  return containsUnexpectedKey || missesMandatoryKey || failsValueValidation
}
