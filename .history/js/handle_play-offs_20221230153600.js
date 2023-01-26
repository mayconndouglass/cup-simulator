/* eslint-disable dot-location */
// AINDA TENHO QUE TIRAR ESSA PARTE DAQUIIIIIIIIIIIIIIIIIIIIIIII

// Funções mudadas para serem usadas nos dois eventos
const checkChangedField = (array, event) => {
  const check = array
    .find(option => event.target.dataset[option])

  return check
}

const searchIndex = (data, bank) => {
  const index = bank.findIndex(({ confrontation }) => confrontation === data)
  return index
}

const getFields = (dataset, classs, number) => {
  const match = `[data-${dataset}="${number}"]`
  const fieldsValues = Array.
    from(document.querySelectorAll(match))
  const goalValues = fieldsValues.map(field => field.value)
  const fieldsPenalty = document.querySelectorAll(`.${classs} [data-penalty="${number}"]`)

  return [goalValues, fieldsPenalty]
}

const updateQualifyingBank = (bankQualifier, bankMatchQualifier) => {
  localStorage.setItem('qualifiers', JSON.stringify(bankQualifier))
  localStorage.setItem('qualifiersMatches', JSON.stringify(bankMatchQualifier))
}

const formatObjQualifier = (number, confrontation, goals, penalty = false) => {
  const objectFormated = {
    number,
    confrontation,
    goals,
    penalty,
  }

  return objectFormated
}

const handlePenalties = ({
  fieldsPenalties,
  number,
  confrontation,
  goalValues,
  qualifierBank,
  qualifierMatchBank,
  numberBank,
  classs,
}) => {
  const [goalsField1, goalsField2] = [fieldsPenalties[0].value, fieldsPenalties[1].value]
  const msg = document.querySelector(`.${classs} [data-message="${number}"]`)
  const draw = goalsField1 === goalsField2

  if (draw) {
    msg.classList.remove('hidden')
    return
  }

  msg.classList.add('hidden')

  if (goalsField1.length && goalsField2.length) {
    const dataMatch = [number, confrontation, goalValues, [goalsField1, goalsField2]]
    const dataMatchPenalty = formatObjQualifier(...dataMatch)

    qualifierBank[numberBank].unshift(dataMatchPenalty)
    qualifierMatchBank[numberBank].unshift(confrontation)
  }

  updateQualifyingBank(qualifierBank, qualifierMatchBank)
}

export default function HandlePlayOffs({
  checkMatchInTheBank,
  removeConfrontationFromTheBank,
  getPlayOffsBank,
  getMatchesPlayOffs,
  removeOrAddClassHidden,
}) {
  const qualifierBank = getPlayOffsBank()
  const qualifierMatchBank = getMatchesPlayOffs()

  const handleQualifyingMatch = ({
    goalValues,
    fieldsPenalties,
    number,
    confrontation,
    numberBank,
  }) => {
    const draw = goalValues[0] === goalValues[1]

    if (draw) {
      removeOrAddClassHidden(fieldsPenalties, 0)
      return
    }

    const dataMatch = formatObjQualifier(number, confrontation, goalValues)

    qualifierBank[numberBank].unshift(dataMatch)
    qualifierMatchBank[numberBank].unshift(confrontation)

    updateQualifyingBank(qualifierBank, qualifierMatchBank)
  }

  const handleOctaves = event => {
    const check = ['octave', 'penalty']
    const changedField = checkChangedField(check, event)
    const octaveNumber = event.target.dataset[changedField]
    const confrontation = document.
      querySelector(`[data-confronOctave="${octaveNumber}"]`).textContent

    const checkMatchBank = checkMatchInTheBank(qualifierMatchBank[0], confrontation)

    if (checkMatchBank !== -1) {
      const indexElement = searchIndex(confrontation, qualifierBank[0])

      removeConfrontationFromTheBank(qualifierMatchBank[0], checkMatchBank)
      removeConfrontationFromTheBank(qualifierBank[0], indexElement)
    }

    const [goalValues, fieldsPenalties] = getFields('octave', 'octaves-container', octaveNumber)
    const data = {
      fieldsPenalties,
      number: octaveNumber,
      confrontation,
      goalValues,
      qualifierBank,
      qualifierMatchBank,
      numberBank: 0,
      classs: 'octaves-container',
    }

    if (changedField === 'penalty') {
      handlePenalties(data)
      return
    }

    if (goalValues[0].length && goalValues[1].length) {
      handleQualifyingMatch(data)
      updateQualifyingBank(qualifierBank, qualifierMatchBank)
      return
    }

    removeOrAddClassHidden(fieldsPenalties, 1)
    updateQualifyingBank(qualifierBank, qualifierMatchBank)
  }

  const handleQuarterfinals = event => {
    const check = ['quarterfinalresult', 'penalty']
    const changedField = checkChangedField(check, event)
    const quarterfinalNumber = event.target.dataset[changedField]
    const confrontation = document.
      querySelector(`.quarterfinals [data-confron="${quarterfinalNumber}"]`).textContent

    const checkMatchBank = checkMatchInTheBank(qualifierMatchBank[1], confrontation)

    if (checkMatchBank !== -1) {
      const indexElement = searchIndex(confrontation, qualifierBank[1])

      removeConfrontationFromTheBank(qualifierMatchBank[1], checkMatchBank)
      removeConfrontationFromTheBank(qualifierBank[1], indexElement)
    }

    const fieldsNames = ['quarterfinalresult', 'quarterfinals', quarterfinalNumber]
    const [goalValues, fieldsPenalties] = getFields(...fieldsNames)
    const data = {
      fieldsPenalties,
      number: quarterfinalNumber,
      confrontation,
      goalValues,
      qualifierMatchBank,
      qualifierBank,
      numberBank: 1,
      classs: 'quarterfinals',
    }

    if (changedField === 'penalty') {
      handlePenalties(data)
      return
    }

    if (goalValues[0].length && goalValues[1].length) {
      handleQualifyingMatch(data)
      return
    }

    removeOrAddClassHidden(fieldsPenalties, 1)
    updateQualifyingBank(qualifierBank, qualifierMatchBank)
  }

  const handleSemifinals = event => {
    const check = ['semifinalresult', 'penalty']
    const changedField = checkChangedField(check, event)
    const semifinalNumber = event.target.dataset[changedField]
    const confrontation = document.
      querySelector(`.semifinals [data-confron="${semifinalNumber}"]`).textContent

    const checkMatchBank = checkMatchInTheBank(qualifierMatchBank[2], confrontation)

    if (checkMatchBank !== -1) {
      const indexElement = searchIndex(confrontation, qualifierBank[2])

      removeConfrontationFromTheBank(qualifierMatchBank[2], checkMatchBank)
      removeConfrontationFromTheBank(qualifierBank[2], indexElement)
    }

    const fieldsNames = ['semifinalresult', 'semifinals', semifinalNumber]
    const [goalValues, fieldsPenalties] = getFields(...fieldsNames)
    const data = {
      fieldsPenalties,
      number: semifinalNumber,
      confrontation,
      goalValues,
      qualifierMatchBank,
      qualifierBank,
      numberBank: 2,
      classs: 'semifinals',
    }

    if (changedField === 'penalty') {
      handlePenalties(data)
      return
    }

    if (goalValues[0].length && goalValues[1].length) {
      handleQualifyingMatch(data)
      // updateQualifyingBank(semifinalBank, semifinalMatchBank)
      return
    }

    removeOrAddClassHidden(fieldsPenalties, 1)
    updateQualifyingBank(qualifierBank, qualifierMatchBank)
  }

  const handleFinals = event => {
    const check = ['finalresult', 'penalty']
    const changedField = checkChangedField(check, event)
    const finalNumber = event.target.dataset[changedField]
    const confrontation = document.
      querySelector(`.finals [data-confron="${finalNumber}"]`).textContent

    const finalBank = getQualifiersBank()
    const finalMatchBank = getMatchesQualifier()
    const checkMatchBank = checkMatchInTheBank(finalMatchBank[3], confrontation)

    if (checkMatchBank !== -1) {
      const indexElement = searchIndex(confrontation, finalBank[3])

      removeElementFromTheBank(finalMatchBank[3], checkMatchBank)
      removeElementFromTheBank(finalBank[3], indexElement)
    }

    const fieldsNames = ['finalresult', 'finals', finalNumber]
    const [goalValues, fieldsPenalties] = getFields(...fieldsNames)
    const data = {
      fieldsPenalties,
      number: finalNumber,
      confrontation,
      goalValues,
      qualifierMatchBank: finalMatchBank,
      qualifierBank: finalBank,
      numberBank: 3,
      classs: 'finals',
    }

    if (changedField === 'penalty') {
      handlePenalties(data)
      return
    }

    if (goalValues[0].length && goalValues[1].length) {
      handleQualifyingMatch(data)
      // updateQualifyingBank(semifinalBank, semifinalMatchBank)
      return
    }

    removeOrAddClassHidden(fieldsPenalties, 1)
    updateQualifyingBank(finalBank, finalMatchBank)
  }

  return {
    handleOctaves,
    handleQuarterfinals,
    handleSemifinals,
  }
}
