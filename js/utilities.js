export default function Utilities() {
  const formatTeamData = (team, number) => {
    const format = `
    <span class="first-line">${number + 1} <img src="./bandeiras/${team.name.toLowerCase()}.png" alt="">${team.name}</span>
    <span class = "points">${team.points}</span>
    <span>${team.matches}</span>
    <span>${team.wins}</span>
    <span>${team.draws}</span>
    <span>${team.defeats}</span>
    <span>${team.gm}</span>
    <span>${team.gc}</span>
    <span>${team.sg}</span>
    `
    const element = document.createElement('div')
    element.setAttribute('class', 'teams-classification')
    element.innerHTML += format

    return element
  }

  const checkMatchInTheBank = (bank, confrontation) => bank
    .findIndex(confron => confron === confrontation)

  const removeConfrontationFromTheBank = (bank, numberConfrontation) => {
    bank.splice(numberConfrontation, 1)
  }

  const removeOrAddClassHidden = (fields, number) => {
    const addOrRemove = number ? 'add' : 'remove'

    fields.forEach(field => {
      field.parentElement.classList[addOrRemove]('hiddenFields')

      if (number) {
        field.value = ''
      }
    })
  }

  return {
    formatTeamData,
    checkMatchInTheBank,
    removeConfrontationFromTheBank,
    removeOrAddClassHidden,
  }
}
