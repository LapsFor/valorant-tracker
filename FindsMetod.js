//player
async function fetchDataPlayer(name, tag) {
  const targetUrl = `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'HDEV-82df1a3a-de20-4395-b774-9a54c92b60b6'
    }
  };

  const response = await fetch(targetUrl, requestOptions);
  const DataPlayer = await response.json();

  const DataPlayerArr = {
    name: DataPlayer.data.name,
    tag: DataPlayer.data.tag,
    LVL: DataPlayer.data.account_level,
    region: DataPlayer.data.region,
    puuid: DataPlayer.data.puuid,
    logo : DataPlayer.data.card.small,
  };

  
  return DataPlayerArr;
}

//mmr
async function fetchDataMMR(name, tag, region) {
  const targetUrl = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${name}/${tag}`;

  const requestOptions = {
    method: 'GET',
    headers: { 
      'Authorization': 'HDEV-82df1a3a-de20-4395-b774-9a54c92b60b6'
    }
  };

  const response = await fetch(targetUrl, requestOptions);
  const DataMMR = await response.json();

  const DataMMRArr = {
    PlayerRank: DataMMR.data.currenttierpatched,
    PlayerRR: DataMMR.data.ranking_in_tier,
    PlayerElo: DataMMR.data.elo,
  };
  return DataMMRArr;
}


//mmr history
async function fetchDataMatchHistory(name, tag, region) {
  const targetUrl = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${name}/${tag}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'HDEV-82df1a3a-de20-4395-b774-9a54c92b60b6'
    }
  };

  const response = await fetch(targetUrl, requestOptions);
  const DataMMRHistory = await response.json();

  return DataMMRHistory;
}


//match details
async function fetchDataMatchDetails(matchId) {
  const targetUrl = `https://api.henrikdev.xyz/valorant/v2/match/${matchId}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'HDEV-82df1a3a-de20-4395-b774-9a54c92b60b6'
    }
  };

  const response = await fetch(targetUrl, requestOptions);
  const DataMatchDetails = await response.json();

  return DataMatchDetails;
}