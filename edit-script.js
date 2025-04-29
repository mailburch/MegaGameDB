const form = document.getElementById('edit-game-form');

// 🔥 Load the game to edit from localStorage
const gameToEdit = JSON.parse(localStorage.getItem('editGame'));
const editIndex = Number(localStorage.getItem('editIndex'));
let games = JSON.parse(localStorage.getItem('gameList')) || [];

if (gameToEdit) {
    document.getElementById('title').value = gameToEdit.title || "";
    document.getElementById('console').value = gameToEdit.console || "";
    document.getElementById('imageUrl').value = gameToEdit.imageUrl || "";
    document.getElementById('description').value = gameToEdit.description || "";
    document.getElementById('priority').value = gameToEdit.priority != null ? gameToEdit.priority : 5;
    document.getElementById('userRating').value = gameToEdit.userRating != null ? gameToEdit.userRating : 0;
    document.getElementById('completion').value = gameToEdit.completion != null ? gameToEdit.completion : 0;
    document.getElementById('tags').value = (gameToEdit.tags && gameToEdit.tags.length > 0) ? gameToEdit.tags.join(', ') : "";
    document.getElementById('status').value = gameToEdit.status || "Backlogged";
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const updatedGame = {
        title: document.getElementById('title').value,
        console: document.getElementById('console').value,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        priority: Number(document.getElementById('priority').value),
        userRating: Number(document.getElementById('userRating').value),
        completion: Number(document.getElementById('completion').value),
        tags: document.getElementById('tags').value.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== ""),
        status: document.getElementById('status').value
    };

    games[editIndex] = updatedGame;
    localStorage.setItem('gameList', JSON.stringify(games));

    localStorage.removeItem('editGame');
    localStorage.removeItem('editIndex');

    window.location.href = "index.html"; // ✅ Go back after saving
});
document.getElementById('image-search-button')?.addEventListener('click', async () => {
    const query = document.getElementById('image-search-input').value.trim();
    if (!query) return;

    const apiKey = '8a845a8c304d421d9f97d3e8336a5903'; // use your real API key
    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    const resultsDiv = document.getElementById('image-search-results');
    resultsDiv.innerHTML = '';

    if (data.results && data.results.length > 0) {
        data.results.forEach(game => {
            const img = document.createElement('img');
            img.src = game.background_image || '';
            img.alt = game.name;
            img.style.width = '80px';
            img.style.height = 'auto';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.style.borderRadius = '8px';

            img.addEventListener('click', () => {
                document.getElementById('imageUrl').value = game.background_image || '';
            });

            resultsDiv.appendChild(img);
        });
    } else {
        resultsDiv.innerHTML = '<p>No images found.</p>';
    }
});
