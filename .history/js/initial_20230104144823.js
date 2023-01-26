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
  div.setAttribute('class', 'group')
}
