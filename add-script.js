const form = document.getElementById('add-game-form');

form.addEventListener('submit', e => {
    e.preventDefault();

    const game = {
        title: document.getElementById('title').value,
        console: document.getElementById('console').value,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        priority: Number(document.getElementById('priority').value),
        userRating: Number(document.getElementById('userRating').value),
        completion: Number(document.getElementById('completion').value),
        tags: document.getElementById('tags').value.split(',').map(t => t.trim().toLowerCase()),
        status: document.getElementById('status').value
    };

    const savedGames = localStorage.getItem('gameList');
    let games = savedGames ? JSON.parse(savedGames) : [];
    games.push(game);
    localStorage.setItem('gameList', JSON.stringify(games));

    window.location.href = "index.html"; // Redirect back to main page
});
