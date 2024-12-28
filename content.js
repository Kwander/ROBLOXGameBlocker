// Store blocked game IDs
let blockedGames = [];

// Load blocked games from storage
chrome.storage.sync.get(['blockedGames'], function(result) {
    if (result.blockedGames) {
        blockedGames = result.blockedGames;
        hideBlockedGames();
    }
});

function getGameId(element) {
    // Try getting ID from home page format first
    let gameId = element.id;
    
    // If no ID found, try getting it from charts page URL format
    if (!gameId) {
        const gameLink = element.querySelector('a[href*="/games/"]') || element;
        if (gameLink && gameLink.href) {
            const universeIdMatch = gameLink.href.match(/universeId=(\d+)/);
            if (universeIdMatch) {
                gameId = universeIdMatch[1];
            }
        }
    }
    return gameId;
}

function addBlockButtons() {
    // For charts page
    const chartGameCards = document.querySelectorAll('.list-item.game-card');
    // For home page
    const homeGameCards = document.querySelectorAll('.game-card-link');
    
    // Handle charts page cards
    chartGameCards.forEach(card => {
        if (!card.querySelector('.game-block-btn')) {
            const gameId = getGameId(card);
            if (!gameId) return;
            
            const blockBtn = document.createElement('button');
            blockBtn.className = 'game-block-btn';
            blockBtn.innerHTML = '✖';
            blockBtn.title = 'Block this game';
            
            blockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!blockedGames.includes(gameId)) {
                    blockedGames.push(gameId);
                    chrome.storage.sync.set({ 'blockedGames': blockedGames });
                    card.remove();
                }
            });
            
            const thumbnailContainer = card.querySelector('.game-card-thumb-container');
            if (thumbnailContainer) {
                thumbnailContainer.appendChild(blockBtn);
            }
        }
    });

    // Handle home page cards
    homeGameCards.forEach(card => {
        if (!card.querySelector('.game-block-btn')) {
            const gameId = getGameId(card);
            if (!gameId) return;
            
            const blockBtn = document.createElement('button');
            blockBtn.className = 'game-block-btn';
            blockBtn.innerHTML = '✖';
            blockBtn.title = 'Block this game';
            
            blockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!blockedGames.includes(gameId)) {
                    blockedGames.push(gameId);
                    chrome.storage.sync.set({ 'blockedGames': blockedGames });
                    const parentDiv = card.parentElement;
                    if (parentDiv) {
                        parentDiv.remove();
                    }
                }
            });
            
            const thumbnailContainer = card.querySelector('.thumbnail-2d-container');
            if (thumbnailContainer) {
                thumbnailContainer.appendChild(blockBtn);
            }
        }
    });
}

function hideBlockedGames() {
    // Hide from charts page
    const chartGameCards = document.querySelectorAll('.list-item.game-card');
    chartGameCards.forEach(card => {
        const gameId = getGameId(card);
        if (gameId && blockedGames.includes(gameId)) {
            card.remove();
        }
    });

    // Hide from home page
    const homeGameCards = document.querySelectorAll('.game-card-link');
    homeGameCards.forEach(card => {
        const gameId = getGameId(card);
        if (gameId && blockedGames.includes(gameId)) {
            const parentDiv = card.parentElement;
            if (parentDiv) {
                parentDiv.remove();
            }
        }
    });
}

// Create an observer to watch for new game cards
const observer = new MutationObserver(() => {
    addBlockButtons();
    hideBlockedGames();
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial run
setTimeout(() => {
    addBlockButtons();
    hideBlockedGames();
}, 1000); 