const errorResponse = (message) => Object({ failed: true, message })
const successResponse = () => Object({ failed: false, message: null })

function uniqueHabitName ({ habit, habits }) {
  const habitNameExists = habits.some(h => h.name == habit.name)
  return {
    failed: habitNameExists,
    message: habitNameExists
      ? 'There is already a habit with that name.'
      : null,
  }
}


function dailyHabitRecord({ record, records }) {
  const habitRecordOnDate = records.some(
    (r) => r.date == record.date && r.habitID == record.habitID
  )
  return {
    failed: habitRecordOnDate,
    message: habitRecordOnDate
      ? 'There is already a record for this habit on the same date.'
      : null
  }
}

function recordAfterHabitCreation({ record, habits }) {
  const habit = habits.find(h => h.id == record.habitID)
  const wrongDate = record.date < habit.createdAt
  return {
    failed: wrongDate,
    message: wrongDate
      ? 'Record date cannot be older than habit creation.'
      : null
  }
}

function untilPresent({ record = null, habit = null }) {
  const inputDate = record ? record.date : habit.createdAt
  const wrongDate = new Date(inputDate) > new Date()
  return {
    failed: wrongDate,
    message: wrongDate
      ? 'Future dates are not allowed.'
      : null
  }
}

const habitRuleValidations = [uniqueHabitName, untilPresent]
const recordRuleValidations = [dailyHabitRecord, recordAfterHabitCreation, untilPresent]

function habitRulesValidator({ habit, habits }) {
  for (let validation of habitRuleValidations) {
    const { failed, message } = validation({ habit, habits })
    if (failed) return errorResponse(message)
  }
  return successResponse()
}

function recordRulesValidator({ record, records, habits }) {
  for (let validation of recordRuleValidations) {
    const { failed, message } = validation({ record, records, habits })
    if (failed) return errorResponse(message)
  }
  return successResponse()
}

export { habitRulesValidator, recordRulesValidator}
