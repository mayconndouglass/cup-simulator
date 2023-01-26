import { LocalStorage, teamsNames } from "./local_storage.js"

const localStoragee = LocalStorage()
const teamsImport = teamsNames

const formatGameData = ({
  diaSemana,
  data,
  hora,
  grupo,
  mandante,
  visitante,
  estadio,
  partida,
}) => {
  const element = document.createElement('div')
  const format = `
  <span>${diaSemana}</span>
  <span>${data}</span>
  <span>${hora}</span>
  <span>${grupo}</span>
  <div class="confrontation">
    <span class="team team-one">
      <img src="./bandeiras/${mandante}" alt="">
      <input type="number" name="${mandante}" data-group="${grupo}" data-confro="${partida}">
    </span>
    <span>${partida}</span>
    <span class="team team-two">
      <input type="number" name="${visitante}" data-group="${grupo}" data-confro="${partida}">
      <img src="./bandeiras/${visitante}" alt="">
    </span>
  </div>
  <span class="local">${estadio}</span>
  `
  element.innerHTML = format
  element.setAttribute('class', 'game')

  return element
}

async function getDataFromFile() {
  const data = await (await fetch('jogos-fase1.json')).json()
  return data
}

const addTeamAbbreviations = (first, second, teams) => {
  const match1 = document.querySelector(`[data-elimination="${first}"]`)
  const match2 = document.querySelector(`[data-elimination="${second}"]`)

  match1.textContent = `${teams[0].abbreviation} x ${teams[1].abbreviation}`
  match2.textContent = `${teams[2].abbreviation} x ${teams[3].abbreviation}`
}

const orderSections = classs => {
  const elements = classs
  const octaves = Array.from(document.querySelectorAll(elements))

  return octaves.sort((qualifier1, qualifier2) =>
    qualifier1.dataset.order - qualifier2.dataset.order)
}

const addFlags = (first, second, teams) => {
  const fieldFlagOne = `[data-flag="${first}"]`
  const fieldFlagTwo = `[data-flag="${second}"]`

  const flagsMatchOne = Array.from(document.querySelectorAll(`.octaves-container ${fieldFlagOne}`))
  const flagsMatchTwo = Array.from(document.querySelectorAll(`.octaves-container ${fieldFlagTwo}`))
  const flags = [...flagsMatchOne, ...flagsMatchTwo]

  flags.forEach((elementFlag, index) => {
    const teamName = teams[index].name

    elementFlag.innerHTML = `
      <img src="./bandeiras/${teamName.toLowerCase()}.png" title="${teamName}">`
  })
}

const addGoalOnFields = (fields, array) => {
  fields.forEach((field, index) => {
    field.value = array[index]
  })
}

const orderQualifiers = (number) => {
  const data = localStoragee.getPlayOffsBank()

  return data[number].sort((obj1, obj2) => obj1.number - obj2.number)
}

const getWinners = (numberBank) => {
  const teamsObj = orderQualifiers(numberBank)

  const winners = teamsObj.map(({ goals, penalty, confrontation }) => {
    const [teamOne, teamTwo] = confrontation.split('x')

    if (penalty) {
      return penalty[0] > penalty[1] ? teamOne.trim() : teamTwo.trim()
    }

    return goals[0] > goals[1] ? teamOne.trim() : teamTwo.trim()
  })

  return winners
}

const getAbbreviation = name => {
  const teamNames = teamsImport.find(team => team[1] === name)

  return teamNames
}

const displayQualifierData = (numberCounter, array, dataset, classs, numberFor) => {
  let counter = 0

  for (let counterFor = numberCounter; counterFor < numberFor; counterFor += 1) {
    const nameTeamOne = getAbbreviation(array[counter])
    const nameTeamTwo = getAbbreviation(array[counter + 1])
    const confrontation = document.querySelector(`[${dataset}="${counterFor + 1}"]`)
    const elementsFlags = document.querySelectorAll(`.${classs} [data-flag="${counterFor + 1}"]`)

    const tNames = [nameTeamOne, nameTeamTwo]
    tNames.forEach((name, index) => {
      elementsFlags[index].innerHTML = `
        <img src="./bandeiras/${name[0].toLowerCase()}.png" title="${name[0]}">`
    })

    confrontation.textContent = `${nameTeamOne[1]} x ${nameTeamTwo[1]}`
    counter += 2
  }
}

const displayPlayoffData = (numberBank, dataset, classs, numberFor) => {
  const winners = getWinners(numberBank)

  displayQualifierData(0, winners, dataset, classs, numberFor)
}

export default function LoadInitialData({
  containerTable,
  getGroupMatchesFromBank,
  containerGroups,
  formatTeamData,
  getBankGroups,
  removeOrAddClassHidden,
  getMatchesPlayOffs,
}) {
  const bankMatchesGroups = getGroupMatchesFromBank()
  const groupsDatabase = getBankGroups()
  const qualifierMatches = getMatchesPlayOffs()

  async function addGamesToInitialTableOnThePage() {
    const data = await getDataFromFile()

    data.forEach(game => {
      const line = formatGameData(game)
      containerTable.appendChild(line)
    })

    if (bankMatchesGroups) {
      bankMatchesGroups.forEach(({ confrontation, match }) => {
        const [teamOne, teamTwo] = document.querySelectorAll(`[data-confro="${confrontation}"]`)
        const [goalsTeamOne, goalsTeamTwo] = match

        teamOne.value = goalsTeamOne
        teamTwo.value = goalsTeamTwo
      })
    }
  }

  const loadsTheInitialGroupsOnthePage = () => {
    if (groupsDatabase.length) {
      for (let counterG = 0; counterG < 8; counterG += 1) {
        for (let counterT = 0; counterT < 4; counterT += 1) {
          const elementTeam = formatTeamData(groupsDatabase[counterG][counterT], counterT)
          containerGroups[counterG].appendChild(elementTeam)
        }
      }
    }
  }

  const loadRoundOf16Matches = () => {
    if (bankMatchesGroups.length === 48) {
      const orderedOctaveSections = orderSections('.octaves-container .qualifiers')

      for (let counter = 0; counter < 8; counter += 2) {
        const firstTeam = orderedOctaveSections[counter].dataset.order
        const secondTeam = orderedOctaveSections[counter + 1].dataset.order

        const [teamOne, teamThree] = groupsDatabase[counter]
        const [teamFor, teamTwo] = groupsDatabase[counter + 1]
        const teams = [teamOne, teamTwo, teamThree, teamFor]

        addTeamAbbreviations(firstTeam, secondTeam, teams)
        addFlags(firstTeam, secondTeam, teams)
      }
    }
  }

  const loadResultsOfRoundOf16Matches = (dataset, classs, numberBank) => {
    const dataQualifier = orderQualifiers(numberBank)
    dataQualifier.forEach(({ number, goals, penalty }) => {
      const fields = document.querySelectorAll(`[${dataset}="${number}"]`)

      addGoalOnFields(fields, goals)

      if (penalty) {
        const fieldsPenalty = document.querySelectorAll(`.${classs} [data-penalty="${number}"]`)

        removeOrAddClassHidden(fieldsPenalty, 0)
        addGoalOnFields(fieldsPenalty, penalty)
      }
    })
  }

  const loadQuarterfinalsMatches = () => {
    const finalOctaves = qualifierMatches[0].length === 8

    if (finalOctaves) {
      const numberBank = 0
      const numberLoop = 4

      displayPlayoffData(numberBank, 'data-orderQuarterfinals', 'quarterfinals', numberLoop)
    }
  }

  const loadResultsQuarterfinalsMatches = () => {
  }

  const loadSemifinalsMatches = () => {
    const finalQuarterFinals = qualifierMatches[1].length === 4

    if (finalQuarterFinals) {
      const numberBank = 1
      const numberLoop = 2

      displayMatchDataOnScreen(numberBank, 'data-orderSemifinals', 'semifinals', numberLoop)
    }
  }

  return {
    addGamesToInitialTableOnThePage,
    loadsTheInitialGroupsOnthePage,
    loadRoundOf16Matches,
    loadResultsOfRoundOf16Matches,
    loadQuarterfinalsMatches,
  }
}
