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
