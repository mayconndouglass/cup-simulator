import { teamsNames } from "./local_storage.js"

const containerGroups = document.querySelector('.container-groups')

const teams = teamsNames
console.log(teams)

const createElementTeam = (team) => {
  const format = `
  <div class="team">
    <img src="./bandeiras/${team.toLowerCase()}.png" alt="${team}">
    <p>${team}</p>
  </div>`

  return format
}

const createGroup = letter => {
  const group = document.createElement('div')
  const h3 = document.createElement('h3')

  h3.textContent = `Grupo ${letter}`
  group.setAttribute('class', 'group')
  group.appendChild(h3)

  return group
}

const letterGroups = [
  'A', 'B', 'C', 'D',
  'E', 'F', 'G', 'H',
]

let counterTeam = 0

letterGroups.forEach(letter => {
  const group = createGroup(letter)

  for (let counter = 0; counter < 4; counter += 1) {
    const team = createElementTeam(teams[counterTeam][0])

    group.innerHTML += team
    counterTeam += 1
  }

  containerGroups.appendChild(group)
})
