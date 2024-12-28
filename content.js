// Store blocked game IDs
let blockedGames = [];

// Load blocked games from storage
chrome.storage.sync.get(['blockedGames'], function(result) {
    if (result.blockedGames) {
        blockedGames = result.blockedGames;
        hideBlockedGames(); // Hide games immediately after loading stored IDs
    }
});

// Function to add block buttons to game cards
function addBlockButtons() {
    const gameLinks = document.querySelectorAll('a.game-card-link');
    
    gameLinks.forEach(link => {
        if (!link.querySelector('.game-block-btn')) {
            const gameId = link.id; // Get the ID directly from the link
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
                    const gameCard = link.closest('.game-card');
                    if (gameCard) {
                        gameCard.remove(); // Remove the element instead of hiding it
                    }
                }
            });
            
            const thumbnailContainer = link.querySelector('.game-card-thumb-container');
            if (thumbnailContainer) {
                thumbnailContainer.appendChild(blockBtn);
            }
        }
    });
}

// Function to hide blocked games
function hideBlockedGames() {
    const gameLinks = document.querySelectorAll('a.game-card-link');
    gameLinks.forEach(link => {
        const gameId = link.id;
        if (blockedGames.includes(gameId)) {
            const gameCard = link.closest('.game-card');
            if (gameCard) {
                gameCard.remove(); // Remove the element instead of hiding it
            }
        }
    });
}

// Create and start the observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            addBlockButtons();
            hideBlockedGames();
        }
    });
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