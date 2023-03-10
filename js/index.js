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
  getPlayOffsBank: localStoragee.getPlayOffsBank,
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
document.addEventListener("DOMContentLoaded", loadInitialData.loadDataOnScreen())

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

// * ainda tenho que mudar o nome da funcao handle match para handle match groups
// (N??O ACHEI UM BOM NOME)
// * quando mudar l?? em cima precisa atualizar embaixo
//* acabei de pensar em uma coisa, e se colocarem valores nos campos antes deles receberem
// os valores dos jogos ? Ser?? q s?? devo adicionar o evento quando passar no if ?
// * AINDA N??O VAI FUNCIONAR, QUANDO TERMINAR AS OITAVAS AINDA VAI PRECISAR
// RECARREGAR A P??GINA PARA A TUALIZAR AS QARTAS E ASSIM SUCESSITVAMENTE, PQ O LOAD QUE
// CARREGA OS DADOS S?? EST?? NO DOMLOADER Q CARREGA S?? QANDO A P??GINA ?? CARREGADA
// BOA SORTE

// 556 Linhas
