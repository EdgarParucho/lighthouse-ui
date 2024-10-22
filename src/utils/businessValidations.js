const errorResponse = (message) => Object({ failed: true, message })
const successResponse = () => Object({ failed: false, message: null })

function uniqueHabitName (habit, habits) {
  const habitNameExists = habits.some(h => h.name == habit.name)
  return {
    failed: habitNameExists,
    message: habitNameExists ? 'You already used that name.' : null,
  }
}

const habitRuleValidations = [uniqueHabitName]

export function habitRulesValidator({ habit, habits }) {
  for (let validation of habitRuleValidations) {
    const { failed, message } = validation(habit, habits)
    if (failed) return errorResponse(message)
  }
  return successResponse()
}
