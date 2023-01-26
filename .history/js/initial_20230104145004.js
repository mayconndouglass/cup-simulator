const containerGroups = document.querySelector('.container-groups')

const createElementTeam = (team) => {
  const format = `
  <div class="team">
    <img src="./bandeiras/${team}.png" alt="${nameTeam}">
    <p>Catar</p>
  </div>`

  return format
}

const createGroup = letter => {
  const div = document.createElement('div')
  const h3 = document.createElement('h3')
  h3.textContent = `Grupo ${letter}`
  div.setAttribute('class', 'group')
  div.appendChild(h3)
}
