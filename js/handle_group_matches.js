import { LocalStorage } from "./local_storage.js"

const localStorage = LocalStorage()
const groups = localStorage.getBankGroups()
const matchesBank = localStorage.getGroupMatchesFromBank()

const handleMatch = {
  resultOfGame(result, addOrRemove, team) {
    const r = result.toUpperCase()
    switch (r) {
      case 'W':
        addOrRemove ? team.points += 3 : team.points -= 3
        addOrRemove ? team.wins += 1 : team.wins -= 1
        break
      case 'E':
        addOrRemove ? team.points += 1 : team.points -= 1
        addOrRemove ? team.draws += 1 : team.draws -= 1
        break
      case 'D':
        addOrRemove ? team.defeats += 1 : team.defeats -= 1
        break
      default:
        console.log('Resultado Inválido')
    }
  },
  goalsScored(team, value, number) {
    number ? team.gm += Number(value) : team.gm -= Number(value)
  },
  goalsConceded(team, value, number) {
    number ? team.gc += Number(value) : team.gc -= Number(value)
    team.sg = team.gm - team.gc
  },
  addGoals(teamOne, valueOne, teamTwo, valueTwo, result) {
    this.goalsScored(teamOne, valueOne, result)
    this.goalsScored(teamTwo, valueTwo, result)

    this.goalsConceded(teamOne, valueTwo, result)
    this.goalsConceded(teamTwo, valueOne, result)
  },
  addPoints(teamOne, teamTwo, winOrDefeat) {
    winOrDefeat ? this.resultOfGame('w', 1, teamOne) : this.resultOfGame('w', 0, teamOne)
    winOrDefeat ? this.resultOfGame('d', 1, teamTwo) : this.resultOfGame('d', 0, teamTwo)
  },
  addResult(teamOne, teamTwo, fieldTeamOne, fieldTeamTwo, result) {
    if (fieldTeamOne === fieldTeamTwo) {
      this.resultOfGame('e', result, teamOne)
      this.resultOfGame('e', result, teamTwo)

      return
    }

    fieldTeamOne > fieldTeamTwo
      ? this.addPoints(teamOne, teamTwo, result)
      : this.addPoints(teamTwo, teamOne, result)
  },
  match(team, result) {
    result ? team.matches += 1 : team.matches -= 1
  },
  addOrRemoveMatch(teamOne, teamTwo, number) {
    [teamOne, teamTwo].forEach((team) => handleMatch.match(team, number))
  },
}

const formatTeamNames = data => {
  const namesFormated = data.map(team => {
    const [teamFormated] = team.name.split('.')
    return teamFormated
  })

  return namesFormated
}

const getClassTeams = (matchData, groupNumber) => {
  const [teamOne, teamTwo] = formatTeamNames(matchData)
  let classTeamOne
  let classTeamTwo

  groups[groupNumber - 1].forEach(team => {
    if (teamOne === team.name.toLowerCase()) {
      classTeamOne = team
    }

    if (teamTwo === team.name.toLowerCase()) {
      classTeamTwo = team
    }
  })

  return [classTeamOne, classTeamTwo]
}

const sortGroup = (groupNumber) => {
  groups[groupNumber - 1].sort((teamOne1, teamTwo2) => {
    if (teamOne1.points === teamTwo2.points) {
      if (teamOne1.sg === teamTwo2.sg) {
        if (teamOne1.gm === teamTwo2.gm) {
          const combination1 = `${teamOne1.abbreviation} x ${teamTwo2.abbreviation}`
          const combination2 = `${teamTwo2.abbreviation} x ${teamOne1.abbreviation}`
          const checkedConfrontation = matchesBank.findIndex(({ confrontation }) =>
            confrontation === combination1 || confrontation === combination2)

          if (checkedConfrontation !== -1) {
            const abbreviations = matchesBank[checkedConfrontation].confrontation.split('x')

            if (abbreviations[0].trim() === teamOne1.abbreviation) {
              const [goalsTeamOne, goalsTeamTwo] = matchesBank[checkedConfrontation].match
              return goalsTeamTwo - goalsTeamOne
            }

            const [goalsTeamTwo, goalsTeamOne] = matchesBank[checkedConfrontation].match
            return goalsTeamOne - goalsTeamTwo
          }
        }
        return teamTwo2.gm - teamOne1.gm
      }
      return teamTwo2.sg - teamOne1.sg
    }
    return teamTwo2.points - teamOne1.points
  })
}

const addConfrontationInTheBank = (valueFieldTeamOne, valueFieldTeamTwo, confrontation) => {
  matchesBank.unshift({
    confrontation,
    match: [valueFieldTeamOne, valueFieldTeamTwo],
  })
}

const removeRowsFromTable = (group) => {
  group.forEach((line, index) => {
    if (index > 1) {
      line.remove()
    }
  })
}

const addNewsRowsFromTable = (groupNumber, formatTeamData, groupTable) => {
  groups[groupNumber - 1].forEach((lineTeam, index) => {
    const elementTeam = formatTeamData(lineTeam, index)

    groupTable.append(elementTeam)
  })
}

export default function HandleMatch({
  containerGroups,
  formatTeamData,
  checkMatchInTheBank,
  removeConfrontationFromTheBank,
}) {
  const updatingLeaderboard = (groupNumber) => {
    const groupTable = containerGroups[groupNumber - 1]
    const groupTableRows = Array.from(groupTable.children)

    removeRowsFromTable(groupTableRows)
    addNewsRowsFromTable(groupNumber, formatTeamData, groupTable)
  }

  const updatesAllDataInTheBank = (groupNumber, matchesBankk, groupss) => {
    updatingLeaderboard(groupNumber)
    localStorage.updateBankMatches(matchesBankk)
    localStorage.updateBankGroups(groupss)
  }

  const addMatchData = ({
    teamOne,
    teamTwo,
    valueFieldTeamOne,
    valueFieldTeamTwo,
    groupNumber,
    confrontation,
  }) => {
    handleMatch.addOrRemoveMatch(teamOne, teamTwo, 1)

    addConfrontationInTheBank(valueFieldTeamOne, valueFieldTeamTwo, confrontation)

    handleMatch
      .addResult(teamOne, teamTwo, valueFieldTeamOne, valueFieldTeamTwo, 1)
    handleMatch
      .addGoals(teamOne, valueFieldTeamOne, teamTwo, valueFieldTeamTwo, 1)

    sortGroup(groupNumber, confrontation)
    updatesAllDataInTheBank(groupNumber, matchesBank, groups)
  }

  const removeMatchData = ({
    teamOne,
    teamTwo,
    groupNumber,
    confrontation,
  }) => {
    const checkMatchNumber = matchesBank
      .findIndex(match => match.confrontation === confrontation)

    if (checkMatchNumber !== -1) {
      const [goalsTeamOne, goalsTeamTwo] = matchesBank[checkMatchNumber].match

      handleMatch.addOrRemoveMatch(teamOne, teamTwo, 0)
      handleMatch
        .addResult(teamOne, teamTwo, Number(goalsTeamOne), Number(goalsTeamTwo), 0)
      handleMatch
        .addGoals(teamOne, Number(goalsTeamOne), teamTwo, Number(goalsTeamTwo), 0)

      removeConfrontationFromTheBank(matchesBank, checkMatchNumber)

      sortGroup(groupNumber, confrontation)
      updatesAllDataInTheBank(groupNumber, matchesBank, groups)
    }
  }

  const handleWithMatchResults = (event) => {
    const confrontation = event.target.dataset.confro
    const fieldsElements = Array
      .from(document.querySelectorAll(`[data-confro="${confrontation}"]`))
    const groupNumber = fieldsElements[0].dataset.group.charCodeAt(0) - 64
    const [teamOne, teamTwo] = getClassTeams(fieldsElements, groupNumber)

    const valueFieldTeamOne = fieldsElements[0].value
    const valueFieldTeamTwo = fieldsElements[1].value
    const fieldsMatch = Boolean(valueFieldTeamOne && valueFieldTeamTwo)

    const data = {
      teamOne,
      teamTwo,
      valueFieldTeamOne,
      valueFieldTeamTwo,
      groupNumber,
      confrontation,
    }

    checkMatchInTheBank(matchesBank, confrontation)

    if (checkMatchInTheBank !== -1) {
      removeMatchData(data)
    }

    if (fieldsMatch) {
      addMatchData(data)
    }
  }

  return {
    handleWithMatchResults,
  }
}
