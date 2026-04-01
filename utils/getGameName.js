function getGameName(gameId) {
    const gameNames = {
        'sky': 'SkyWars',
        'bed': 'BedWars',
        'ctf': 'Capture The Flag',
        'hide': 'Hide And Seek',
        'dr': 'Death Run',
        'murder': 'Murder Mystery',
        'sg': 'Survival Games',
        'drop': 'Block Drop',
        'ground': 'Ground Wars',
        'build': 'Build Battle',
        'party': 'Block Party',
        'bridge': 'The Bridge',
        'grav': 'Gravity'
    };
    return gameNames[gameId] || 'Unknown Game';
}

module.exports = {
    getGameName
};