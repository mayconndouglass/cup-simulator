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
})

containerTable.addEventListener('input', event => handleGroupsMatches
  .handleWithMatchResults(event))

octavesContainer.addEventListener('input', event => handlePlayOffs
  .handleOctaves(event))

containerQuarterfinals.addEventListener('input', event => handlePlayOffs.
  handleQuarterfinals(event))

// EM CONSTRUÇÃAAAAAAAAAAAAAAAAAAAAAAO000000000000000000000000000000000000

// Daqui p baixo as funções devem ser reaproveitadas ps semi e final ///////////////////////////
// QUartas de finais ///////////////////////////

const qualifierBank = () => getQualifiersBank()
const matches = qualifierBank()// não faço ideia pq só funcionou assim
// carregando os resultados das quartas
loadPlayoffData('data-quarterfinalresult', 'quarterfinals', 1)

// Construção das semifinais
const containerSemifinals = document.querySelector('.semifinals')

containerSemifinals.addEventListener('input', event => {
  const check = ['semifinalresult', 'penalty']
  const changedField = checkChangedField(check, event)
  const semifinalNumber = event.target.dataset[changedField]
  const confrontation = document.
    querySelector(`.semifinals [data-confron="${semifinalNumber}"]`).textContent

  const semifinalBank = getQualifiersBank()
  const semifinalMatchBank = getMatchesQualifier()
  const checkMatchBank = checkMatchInTheBank(semifinalMatchBank[2], confrontation)

  if (checkMatchBank !== -1) {
    const indexElement = searchIndex(confrontation, semifinalBank[2])

    removeElementFromTheBank(semifinalMatchBank[2], checkMatchBank)
    removeElementFromTheBank(semifinalBank[2], indexElement)
  }

  const fieldsNames = ['semifinalresult', 'semifinals', semifinalNumber]
  const [goalValues, fieldsPenalties] = getFields(...fieldsNames)
  const data = {
    fieldsPenalties,
    number: semifinalNumber,
    confrontation,
    goalValues,
    qualifierMatchBank: semifinalMatchBank,
    qualifierBank: semifinalBank,
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
  updateQualifyingBank(semifinalBank, semifinalMatchBank)
})

// Carregando dados do localStorage p tela das semifinais
loadPlayoffData('data-semifinalresult', 'semifinals', 2)

// função só p pegar os que vão disputar o terceiro lugar
const getLosers = () => {
  const winners = getWinners(2)

  const losers = matches[2].map(({ confrontation }) => {
    const confron = confrontation.split('x')
    const loser = confron
      .find(name => name.trim() !== winners[0] && name.trim() !== winners[1])

    return loser.trim()
  })

  return losers
}
// Final e terceiro lugar
const containerFinals = document.querySelector('.finals')

containerFinals.addEventListener('input', event => {
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
})

// Carregando os dados da final e do terceiro lugar
loadPlayoffData('data-finalresult', 'finals', 3)

// * ainda tenho que mudar o nome da funcao handle match para handle match groups
// (NÃO ACHEI UM BOM NOME)
// * quando mudar lá em cima precisa atualizar embaixo
//* acabei de pensar em uma coisa, e se colocarem valores nos campos antes deles receberem
// os valores dos jogos ? Será q só devo adicionar o evento quando passar no if ?
// BOA SORTE

// 556 Linhas
