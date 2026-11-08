// const trak2 = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&date=20200302&json');
// const data = await trak2.json();

const button = document.getElementById('FindButton');
const inputName = document.getElementById('inputName');
const inputTag = document.getElementById('inputTag');
const inputRegion = document.getElementById('inputRegion');

const PlayerNameElement = document.getElementById('player-name');
const PlayerRankElement = document.getElementById('player-rank');
const PlayerTagElement = document.getElementById('player-tag');
const PlayerLogoElement = document.getElementById('player-logo');

const PlayerTierElement = document.getElementById('player-tier');
const PlayerRRElement = document.getElementById('player-rr');
const PlayerEloElement = document.getElementById('player-elo');

let DataPlayerNameTagLVLRegionPUUID = null; // Переменная для хранения данных игрока из функции fetchDataPlayer
let DataMMRPlayerRankRR = null; // Переменная для хранения данных MMR игрока из функции fetchDataMMR
let DataPlayerMatchHistory = null; // Переменная для хранения данных истории матчей игрока из функции fetchDataMatchHistory

button.addEventListener('click', async () => {
  const name = inputName.value;
  const tag = inputTag.value;
  const region = inputRegion.value;
  
  DataPlayerNameTagLVLRegionPUUID = await fetchDataPlayer(name, tag);
  console.log('DataPlayerNameTagLVLRegionPUUID:', DataPlayerNameTagLVLRegionPUUID);

  PlayerNameElement.textContent = DataPlayerNameTagLVLRegionPUUID.name;
  PlayerRankElement.textContent = `Ур. ${DataPlayerNameTagLVLRegionPUUID.LVL}`;
  PlayerTagElement.textContent = `#${DataPlayerNameTagLVLRegionPUUID.tag}`;
  PlayerLogoElement.style.backgroundImage = `url(${DataPlayerNameTagLVLRegionPUUID.logo})`;

  DataMMRPlayerRankRR = await fetchDataMMR(name, tag, region);
  console.log('DataMMRPlayerRankRR:', DataMMRPlayerRankRR);

  PlayerTierElement.textContent = DataMMRPlayerRankRR.PlayerRank;
  PlayerRRElement.textContent = `• ${DataMMRPlayerRankRR.PlayerRR} RR`;
  PlayerEloElement.textContent = `• ${DataMMRPlayerRankRR.PlayerElo} ELO`;

  DataPlayerMatchHistory = await fetchDataMatchHistory(name, tag, region);
  console.log('DataPlayerMatchHistory:', DataPlayerMatchHistory);
  // матчи 
  ShowMatchHistory(DataPlayerMatchHistory); // Вызов функции для отображения истории матчей

  //Match = await fetchDataMatchDetails('84463967-190c-406b-a289-dd27882cd6a1');
  //console.log('Match:', Match); // тест вызова функции для получения деталей матча

  showPage('stats-page');  
});



