/* eslint-disable dot-location */
import { LocalStorage } from "./local_storage.js"
import LoadInitialData from "./load_initial_data.js"
import Utilities from "./utilities.js"
import HandleGroupMatches from "./handle_group_matches.js"
import HandlePlayOffs from "./handle_play-offs.js"

// Calls
const containerTable = document.querySelector('.table-games')
const containerGroups = Array.from(document.querySelectorAll('.table-classification'))
const octavesContainer = document.querySelector('.octaves-container')
const containerQuarterfinals = document.querySelector('.quarterfinals')
const containerSemifinals = document.querySelector('.semifinals')
const containerFinals = document.querySelector('.finals')

// Imports
const utilities = Utilities()

const localStoragee = LocalStorage()

const loadInitialData = LoadInitialData({
  containerTable,
  getGroupMatchesFromBank: localStoragee.getGroupMatchesFromBank,
  containerGroups,
  formatTeamData: utilities.formatTeamData,
  getBankGroups: localStoragee.getBankGroups,
  removeOrAddClassHidden: utilities.removeOrAddClassHidden,
  getMatchesPlayOffs: localStoragee.getMatchesPlayOffs,
})

const handleGroupsMatches = HandleGroupMatches({
  containerGroups,
  formatTeamData: utilities.formatTeamData,
  checkMatchInTheBank: utilities.checkMatchInTheBank,
  removeConfrontationFromTheBank: utilities.removeConfrontationFromTheBank,
})

const handlePlayOffs = HandlePlayOffs({
  checkMatchInTheBank: utilities.checkMatchInTheBank,
  removeConfrontationFromTheBank: utilities.removeConfrontationFromTheBank,
  getPlayOffsBank: localStoragee.getPlayOffsBank,
  getMatchesPlayOffs: localStoragee.getMatchesPlayOffs,
  removeOrAddClassHidden: utilities.removeOrAddClassHidden,
})

// Events
document.addEventListener("DOMContentLoaded", () => {
  loadInitialData.addGamesToInitialTableOnThePage()
  loadInitialData.loadsTheInitialGroupsOnthePage()
  loadInitialData.loadRoundOf16Matches()
  loadInitialData.loadResultsOfRoundOf16Matches('data-octave', 'octaves-container', 0)
  loadInitialData.loadQuarterfinalsMatches()
  loadInitialData.loadSemifinalsMatches()
  loadInitialData.loadFinalsMatches()
})

containerTable.addEventListener('input', event => handleGroupsMatches
  .handleWithMatchResults(event))

octavesContainer.addEventListener('input', event => handlePlayOffs
  .handleOctaves(event))

containerQuarterfinals.addEventListener('input', event => handlePlayOffs.
  handleQuarterfinals(event))

containerSemifinals.addEventListener('input', event => handlePlayOffs.
  handleSemifinals(event))

containerFinals.addEventListener('input', event => handlePlayOffs.
  handleFinals(event))

// EM CONSTRUÇÃAAAAAAAAAAAAAAAAAAAAAAO000000000000000000000000000000000000
const loadPlayoffData = (dataSet, classs, numberBank) => {
  const bank = localStoragee.getMatchesPlayOffs()
  console.log(bank[numberBank])
}

const bank = localStoragee.getPlayOffsBank()
console.log(bank[1])

// carregando os resultados das quartas
loadPlayoffData('data-quarterfinalresult', 'quarterfinals', 1)

// Carregando dados do localStorage p tela das semifinais
loadPlayoffData('data-semifinalresult', 'semifinals', 2)

// Carregando os dados da final e do terceiro lugar
loadPlayoffData('data-finalresult', 'finals', 3)

// * ainda tenho que mudar o nome da funcao handle match para handle match groups
// (NÃO ACHEI UM BOM NOME)
// * quando mudar lá em cima precisa atualizar embaixo
//* acabei de pensar em uma coisa, e se colocarem valores nos campos antes deles receberem
// os valores dos jogos ? Será q só devo adicionar o evento quando passar no if ?
// BOA SORTE

// 556 Linhas
