// === MAIN DATA ===
let games = [];
let editIndex = null;
let selectedTags = [];
let selectedConsoles = [];

// === LOAD FROM LOCAL STORAGE ===
const savedGames = localStorage.getItem('gameList');
if (savedGames) {
    games = JSON.parse(savedGames);
}

function saveGames() {
    localStorage.setItem('gameList', JSON.stringify(games));
}

// === RENDER GAMES ===
function renderGames() {
    const list = document.getElementById('game-list');
    const sort = document.getElementById('sort-by')?.value || "";
    const searchText = document.getElementById('search')?.value.toLowerCase() || "";
    const statusFilter = document.getElementById('status-filter')?.value || "";

    let filtered = games.filter(g => {
        let matchConsole = selectedConsoles.length === 0 || selectedConsoles.includes(g.console);
        let matchSearch = g.title.toLowerCase().includes(searchText);
        let matchTags = selectedTags.length === 0 || selectedTags.some(tag => g.tags.includes(tag.toLowerCase()));
        let matchStatus = !statusFilter || g.status === statusFilter;
        return matchConsole && matchSearch && matchTags && matchStatus;
    });

    if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "priority") filtered.sort((a, b) => b.priority - a.priority);
    if (sort === "completion") filtered.sort((a, b) => b.completion - a.completion);

    list.innerHTML = filtered.map((g, index) => `
        <div class="game-card">
            ${g.imageUrl ? `<img src="${g.imageUrl}" alt="${g.title}">` : ""}
            <h3>${g.title}</h3>
            <small><strong>${g.console}</strong> | Priority: ${g.priority}</small>
            <div class="progress-bar"><div style="width: ${Math.round(g.completion * 100)}%"></div></div>
            <p>${g.description}</p>
            <p>User Rating: ${g.userRating}/10</p>
            <p>Status: <strong>${g.status}</strong></p>
            <p>Tags: ${g.tags.map(tag => `<span class="tag clickable-tag ${selectedTags.includes(tag.toLowerCase()) ? 'active' : ''}" onclick="filterByTag('${tag}')">${tag}</span>`).join(' ')}</p>
            <button onclick="editGameByTitle('${g.title.replace(/'/g, "\\'")}')">Edit</button>
            <button onclick="deleteGameByTitle('${g.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
    `).join("");
}

// === FILTER BY CLICKABLE TAG ===
function filterByTag(tag) {
    const tagLower = tag.toLowerCase();
    if (selectedTags.includes(tagLower)) {
        selectedTags = selectedTags.filter(t => t !== tagLower);
    } else {
        selectedTags.push(tagLower);
    }
    renderGames();
}

// === EDIT / DELETE GAME ===
function editGame(index) {
    const game = games[index];
    localStorage.setItem('editGame', JSON.stringify(game));
    localStorage.setItem('editIndex', index);
    window.location.href = "edit.html";
}

function deleteGame(index) {
    if (confirm("Delete this game?")) {
        games.splice(index, 1);
        saveGames();
        renderGames();
    }
}

// === RAWG API SEARCH ===
const apiKey = '8a845a8c304d421d9f97d3e8336a5903'; // Insert your real API key

document.getElementById('online-search-button')?.addEventListener('click', async () => {
    const query = document.getElementById('online-search-input')?.value.trim();
    if (!query) return;

    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    const resultsDiv = document.getElementById('online-results');
    resultsDiv.innerHTML = '';

    if (data.results?.length > 0) {
        data.results.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('online-game');

            const addButton = document.createElement('button');
            addButton.textContent = "Add";
            addButton.addEventListener('click', () => addOnlineGame(game));

            gameDiv.innerHTML = `
                <img src="${game.background_image || ''}" alt="${game.name}" style="width:100px;height:auto;border-radius:5px;">
                <div>
                    <h4>${game.name} (${game.released ? game.released.split('-')[0] : 'Unknown'})</h4>
                </div>
            `;
            gameDiv.querySelector('div').appendChild(addButton);

            resultsDiv.appendChild(gameDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>No games found.</p>';
    }
});

function addOnlineGame(game) {
    const newGame = {
        title: game.name,
        console: (game.platforms && game.platforms.length > 0) ? game.platforms[0].platform.name : 'Unknown',
        imageUrl: game.background_image || '',
        description: '',
        priority: 5,
        userRating: 0,
        completion: 0,
        tags: [],
        status: 'Backlogged'
    };

    games.push(newGame);
    saveGames();
    renderGames();
    alert(`✅ "${newGame.title}" added to your Game DB!`);
}

// === SHOOTING STARS ===
function createShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    star.style.top = Math.random() * window.innerHeight * 0.5 + "px";
    star.style.left = Math.random() * window.innerWidth * 0.5 + "px";
    document.getElementById('shooting-stars').appendChild(star);

    setTimeout(() => {
        star.remove();
    }, 1000);
}

function shootingStarsLoop() {
    setInterval(createShootingStar, Math.random() * 30000 + 30000);
}
shootingStarsLoop();

// === MULTI-TAG FILTER DROPDOWN ===
const allTags = [
    'RPG', 'Action', 'Adventure', 'Horror', 'Stealth', 'Multiplayer', 'Open World',
    'Shooter', 'Fighting', 'Platformer', 'Simulation', 'Strategy', 'Puzzle', 'Rhythm',
    'Indie', 'Metroidvania', 'Soulslike', 'Point & Click', 'MMO', 'Roguelike', 'Crafting'
];

const tagDropdown = document.getElementById('tag-dropdown');

allTags.forEach(tag => {
    const label = document.createElement('label');
    label.innerHTML = `
        <input type="checkbox" value="${tag.toLowerCase()}" onchange="toggleTag(this)">
        <span>${tag}</span>
    `;
    tagDropdown.appendChild(label);
});

document.getElementById('tag-dropdown-btn')?.addEventListener('click', () => {
    tagDropdown.style.display = tagDropdown.style.display === 'flex' ? 'none' : 'flex';
});

function toggleTag(checkbox) {
    const tag = checkbox.value;
    if (checkbox.checked) {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
        }
    } else {
        selectedTags = selectedTags.filter(t => t !== tag);
    }
    renderGames();
}

// === MULTI-CONSOLE FILTER DROPDOWN ===
const allConsoles = [
    'NES', 'SNES', 'Genesis', 'N64', 'GameCube', 'Wii', 'Wii U', 'Switch',
    'DS', 'DSi', '3DS', 'Game Boy', 'GBA', 'PS1', 'PS2', 'PS3', 'PS4', 'PS5',
    'PSP', 'PS Vita', 'XBOX', 'XBOX 360', 'XBOX ONE', 'XBOX Series X',
    'Steam', 'Epic Games', 'PC', 'Mobile', 'Other'
];

const consoleDropdown = document.getElementById('console-dropdown');

allConsoles.forEach(consoleName => {
    const label = document.createElement('label');
    label.innerHTML = `
        <input type="checkbox" value="${consoleName}" onchange="toggleConsole(this)">
        <span>${consoleName}</span>
    `;
    consoleDropdown.appendChild(label);
});

document.getElementById('console-dropdown-btn')?.addEventListener('click', () => {
    consoleDropdown.style.display = consoleDropdown.style.display === 'flex' ? 'none' : 'flex';
});

function toggleConsole(checkbox) {
    const consoleName = checkbox.value;
    if (checkbox.checked) {
        if (!selectedConsoles.includes(consoleName)) {
            selectedConsoles.push(consoleName);
        }
    } else {
        selectedConsoles = selectedConsoles.filter(c => c !== consoleName);
    }
    renderGames();
}

// === EVENT LISTENERS ===
document.getElementById('sort-by')?.addEventListener('change', renderGames);
document.getElementById('search')?.addEventListener('input', renderGames);
document.getElementById('status-filter')?.addEventListener('change', renderGames);

// === INITIAL LOAD ===
renderGames();

function editGameByTitle(title) {
    const realIndex = games.findIndex(g => g.title === title);
    if (realIndex !== -1) {
        const game = games[realIndex];
        localStorage.setItem('editGame', JSON.stringify(game));
        localStorage.setItem('editIndex', realIndex);
        window.location.href = "edit.html";
    } else {
        alert("⚠️ Game not found!");
    }
}

function deleteGameByTitle(title) {
    const realIndex = games.findIndex(g => g.title === title);
    if (realIndex !== -1) {
        if (confirm(`Delete "${title}"?`)) {
            games.splice(realIndex, 1);
            saveGames();
            renderGames();
        }
    } else {
        alert("⚠️ Game not found!");
    }
}
