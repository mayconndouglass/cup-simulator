class Team {
  points = 0
  matches = 0
  wins = 0
  draws = 0
  defeats = 0
  gm = 0
  gc = 0
  sg = 0

  constructor(name, abbreviation) {
    this.name = name
    this.abbreviation = abbreviation
  }
}

export const teamsNames = [
  ['Catar', 'CAT'], ['Equador', 'EQU'], ['Holanda', 'HOL'], ['Senegal', 'SEN'],
  ['Estados Unidos', 'EUA'], ['Gales', 'GAL'], ['Inglaterra', 'ING'], ['Irã', 'IRA'],
  ['Arábia Saudita', 'ARA'], ['Argentina', 'ARG'], ['México', 'MEX'], ['Polônia', 'POL'],
  ['Austrália', 'AUS'], ['Dinamarca', 'DIN'], ['França', 'FRA'], ['Tunísia', 'TUN'],
  ['Alemanha', 'ALE'], ['Costa Rica', 'COS'], ['Espanha', 'ESP'], ['Japão', 'JAP'],
  ['Bélgica', 'BEL'], ['Canadá', 'CAN'], ['Croácia', 'CRO'], ['Marrocos', 'MAR'],
  ['Brasil', 'BRA'], ['Camarões', 'CAM'], ['Sérvia', 'SER'], ['Suíça', 'SUI'],
  ['Coreia do Sul', 'COR'], ['Gana', 'GAN'], ['Portugal', 'POR'], ['Uruguai', 'URU'],
]

const qualifiersBank = [[], [], [], []]
const qualifierMatchesBank = [[], [], [], []]

const groups = [[], [], [], [], [], [], [], []]
let group = 0
let teamCounter = 0

for (let counter = 0; counter < 32; counter += 1) {
  const teamTemp = teamsNames[counter][0].toLowerCase()
  groups[group].push(window[teamTemp] = new Team(teamsNames[counter][0], teamsNames[counter][1]))

  if (teamCounter === 3) {
    group += 1
    teamCounter = -1
  }

  teamCounter += 1
}

export function LocalStorage() {
  const updateBankGroups = groupsBank => localStorage.setItem('bankGroups', JSON.stringify(groupsBank))
  const getBankGroups = () => JSON.parse(localStorage.getItem('bankGroups')) ?? groups
  const updateBankMatches = matches => localStorage.setItem('bankMatches', JSON.stringify(matches))
  const getGroupMatchesFromBank = () => JSON.parse(localStorage.getItem('bankMatches')) ?? []
  const getMatchesPlayOffs = () => JSON.parse(localStorage.getItem('qualifiersMatches')) ?? qualifierMatchesBank
  const getPlayOffsBank = () => JSON.parse(localStorage.getItem('qualifiers')) ?? qualifiersBank

  return {
    updateBankGroups,
    getBankGroups,
    updateBankMatches,
    getGroupMatchesFromBank,
    getMatchesPlayOffs,
    getPlayOffsBank,
  }
}
