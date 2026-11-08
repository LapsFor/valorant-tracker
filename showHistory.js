const PlayerMatchHistoryElement = document.getElementById('matches-container'); // Контейнер для истории матчей 

function RenderMatchDetails(matchData) {
    const mapNameEl = document.getElementById('detail-map-name');
    const scoreEl = document.getElementById('detail-match-score');
    const playersContainer = document.getElementById('match-players-container');

    // Очищаем контейнер перед новой отрисовкой
    playersContainer.innerHTML = '';

    // 1. Извлекаем базовые данные матча
    const metadata = matchData.data.metadata;
    const teams = matchData.data.teams;
    const allPlayers = matchData.data.players.all_players;
    
    // Общее количество раундов (нужно для расчета ACS)
    const totalRounds = metadata.rounds_played;

    // Выводим карту и общий счет
    mapNameEl.textContent = metadata.map;
    scoreEl.textContent = `${teams.blue.rounds_won} : ${teams.red.rounds_won}`;

    // 2. Разделяем игроков на команды и сортируем по убыванию боевого счета (Score)
    const blueTeam = allPlayers.filter(p => p.team === 'Blue').sort((a, b) => b.stats.score - a.stats.score);
    const redTeam = allPlayers.filter(p => p.team === 'Red').sort((a, b) => b.stats.score - a.stats.score);

    // 3. Вспомогательная функция для создания таблицы одной команды
    const createTeamTable = (teamPlayers, teamName, teamColorHex, roundsWon) => {
        let tableHTML = `
            <div class="team-section mb-4">
                <!-- Шапка команды -->
                <div class="d-flex justify-content-between px-3 py-2 rounded-top" style="background-color: ${teamColorHex}; color: white;">
                    <span class="fw-bold">${teamName}</span>
                    <span class="fw-bold">Счет: ${roundsWon}</span>
                </div>
                
                <!-- Таблица игроков -->
                <div class="table-responsive bg-dark rounded-bottom p-2">
                    <table class="table table-dark table-borderless table-hover align-middle mb-0 text-center" style="font-size: 0.9rem;">
                        <thead class="text-muted-custom border-bottom border-secondary">
                            <tr>
                                <th class="text-start" style="width: 25%;">Агент / Игрок</th>
                                <th>Ранг</th>
                                <th>ACS</th>
                                <th>K</th>
                                <th>D</th>
                                <th>A</th>
                                <th>+/-</th>
                                <th>K/D</th>
                                <th>HS%</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        // Проходимся по каждому игроку команды
        teamPlayers.forEach(player => {
            // Математика статистики...
            const k = player.stats.kills;
            const d = player.stats.deaths;
            const a = player.stats.assists;
            const acs = Math.round(player.stats.score / totalRounds);
            const plusMinus = k - d;
            const pmColor = plusMinus > 0 ? 'text-success' : (plusMinus < 0 ? 'text-danger' : 'text-secondary');
            const pmSign = plusMinus > 0 ? '+' : '';
            const kd = d > 0 ? (k / d).toFixed(2) : k;
            const headshots = player.stats.headshots;
            const bodyshots = player.stats.bodyshots;
            const legshots = player.stats.legshots;
            const totalShots = headshots + bodyshots + legshots;
            const hsPercent = totalShots > 0 ? Math.round((headshots / totalShots) * 100) + '%' : '0%';
            const rankName = player.currenttier_patched || 'Unranked';

            // ГЕНЕРИРУЕМ СТРОКУ ИГРОКА (Вот здесь должен быть <tr> с data-атрибутами!)
            tableHTML += `
                <tr class="player-row" 
                    data-name="${player.name}" 
                    data-tag="${player.tag}" 
                    style="cursor: pointer;" 
                    title="Нажми, чтобы открыть профиль">
                    <td class="text-start">
                        <div class="d-flex align-items-center gap-2" style="max-width: 160px;">
                            <img src="${player.assets.agent.small}" alt="Agent" style="width: 35px; height: 35px; border-radius: 50%;">
                            <div class="d-flex flex-column overflow-hidden">
                                <span class="fw-bold text-white text-truncate" title="${player.name}">${player.name}</span>
                                <span class="text-muted-custom text-truncate" style="font-size: 0.75rem;">#${player.tag}</span>
                            </div>
                        </div>
                    </td>
                    <td><span style="font-size: 0.8rem;">${rankName}</span></td>
                    <td class="fw-bold text-white">${acs}</td>
                    <td>${k}</td>
                    <td>${d}</td>
                    <td>${a}</td>
                    <td class="${pmColor}">${pmSign}${plusMinus}</td>
                    <td class="fw-bold">${kd}</td>
                    <td>${hsPercent}</td>
                </tr>
            `;
        });

        tableHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        return tableHTML;
    };

    // 4. Отрисовываем обе таблицы в контейнер
    playersContainer.insertAdjacentHTML('beforeend', createTeamTable(blueTeam, 'Команда Синих', '#00a58e', teams.blue.rounds_won));
    playersContainer.insertAdjacentHTML('beforeend', createTeamTable(redTeam, 'Команда Красных', '#ff4655', teams.red.rounds_won));
}

function ShowMatchHistory(matchesData) {
    PlayerMatchHistoryElement.innerHTML = ''; 

    matchesData.data.forEach((match) => {
        let matchClass = '';
        let rrSign = '';
        let borderClass = ''; // Переменная для серой обводки

        if (match.mmr_change_to_last_game > 0) {
            matchClass = 'match-win';
            rrSign = '+';
        } else if (match.mmr_change_to_last_game < 0) {
            matchClass = 'match-loss';
        } else {
            matchClass = 'match-draw';
            borderClass = 'border border-2 border-secondary'; // Добавляем обводку для ничьей
        }

        // Проверка на некомпетитив (если данные о режиме доступны в JSON)
        if (match.mode && match.mode !== 'Competitive') {
            borderClass = 'border border-2 border-secondary'; // Добавляем обводку для других режимов
        }

        const cardHTML = `
        <div class="match-card ${matchClass} ${borderClass} d-flex justify-content-between align-items-center p-3 rounded mb-2" 
        data-matchid="${match.match_id}" 
        style="cursor: pointer;">
            <div class="fw-bold" style="width: 80px;">${match.map.name}</div>
            <div class="fs-5 fw-bold rr-change">${rrSign}${match.mmr_change_to_last_game}</div>
            <div class="d-flex align-items-center gap-2" style="width: 120px;">
                <img src="${match.images.small}" alt="Rank Icon" style="width: 35px; height: 35px; object-fit: contain;">
                <span class="text-muted-custom">${match.currenttierpatched}</span>
            </div>
        </div>
    `;

        PlayerMatchHistoryElement.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// =========================================================
// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ (выполняется один раз)
// =========================================================

// Используем тот же элемент, который уже нашли в начале файла,
// чтобы не делать повторный поиск по DOM (это ускоряет работу скрипта)
PlayerMatchHistoryElement.addEventListener('click', async (event) => {
    const clickedCard = event.target.closest('.match-card');
    
    // Если клик был не по карточке матча — игнорируем
    if (!clickedCard) return;

    const matchId = clickedCard.dataset.matchid;
    console.log(`📡 Загружаю детали матча: ${matchId}`);

    try {
        // Делаем запрос к API (убедись, что функция fetchDataMatchDetails подключена)
        const matchDetails = await fetchDataMatchDetails(matchId);
        
        // Рендерим таблицы с игроками
        RenderMatchDetails(matchDetails);
        
        // Показываем страницу деталей
        showPage('match-details-page');
    } catch (error) {
        console.error('❌ Ошибка при загрузке матча:', error);
    }
});

// =========================================================
// 1. СЛУШАТЕЛЬ КЛИКА ПО ИГРОКУ (Очищенный)
// =========================================================
// =========================================================
// КЛИК ПО ИГРОКУ В ТАБЛИЦЕ (Остается без изменений)
// =========================================================
const playersContainer = document.getElementById('match-players-container');

playersContainer.addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('.player-row');
    if (!clickedRow) return;

    const targetName = clickedRow.dataset.name;
    const targetTag = clickedRow.dataset.tag;

    console.log(`🔄 Переключаемся на игрока: ${targetName}#${targetTag}`);
    showPlayerProfile(targetName, targetTag);
});

// =========================================================
// ИДЕАЛЬНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ (Копия логики твоей кнопки)
// =========================================================
async function showPlayerProfile(name, tag) {
    // Берем регион из инпута (чтобы он совпадал с тем, что выбран на главной)
    const region = inputRegion.value || 'eu'; 

    try {
        // 1. Запрашиваем данные аккаунта (Уровень, Аватарка)
        const newPlayerData = await fetchDataPlayer(name, tag);
        
        // Вставляем данные точно так же, как в твоем скрипте кнопки
        PlayerNameElement.textContent = newPlayerData.name;
        PlayerRankElement.textContent = `Ур. ${newPlayerData.LVL}`;
        PlayerTagElement.textContent = `#${newPlayerData.tag}`;
        PlayerLogoElement.style.backgroundImage = `url(${newPlayerData.logo})`;

        // 2. Запрашиваем данные MMR (Ранг, RR, Elo)
        const newMMRData = await fetchDataMMR(name, tag, region);
        
        PlayerTierElement.textContent = newMMRData.PlayerRank;
        PlayerRRElement.textContent = `• ${newMMRData.PlayerRR} RR`;
        PlayerEloElement.textContent = `• ${newMMRData.PlayerElo} ELO`;

        // 3. Запрашиваем новую историю матчей
        const newMatchHistory = await fetchDataMatchHistory(name, tag, region);
        
        // 4. Отрисовываем матчи
        ShowMatchHistory(newMatchHistory);

        // 5. ОПЦИОНАЛЬНО: Обновляем твои глобальные переменные, 
        // чтобы остальной скрипт знал, что мы теперь смотрим другого игрока
        DataPlayerNameTagLVLRegionPUUID = newPlayerData;
        DataMMRPlayerRankRR = newMMRData;
        DataPlayerMatchHistory = newMatchHistory;

        // 6. Скрываем детали матча и возвращаемся к профилю
        showPage('stats-page');

    } catch (error) {
        console.error('❌ Ошибка при загрузке нового профиля:', error);
    }
}