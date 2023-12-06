let isLoading = false;
let loadedCardsCount = 0;

function showLoading() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = 'block';
}

function hideLoading() {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = 'none';
}

function loadMoreCards() {
    isLoading = true;
    showLoading();

    fetch('https://mmo-games.p.rapidapi.com/games', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'mmo-games.p.rapidapi.com',
            'X-RapidAPI-Key': '1c3169c707mshb51bff34cbc9ff6p1749b9jsn648a19134256',
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderGames(data.slice(loadedCardsCount, loadedCardsCount + 50));
            loadedCardsCount += 50;
            isLoading = false;
            hideLoading();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            isLoading = false;
            hideLoading();
        });
}

const gamesData = games.map((game) => ({ ...game, isNew: game.release_date.includes('2022') }));

function createCardElement(game) {
    const template = document.querySelector('.card-template');

    if (!template) {
        console.error('Template not found');
        return null;
    }

    const clone = document.importNode(template.content, true);

    const gameTopImgElement = clone.querySelector('[data-type="Games__cards_top_img"]');
    if (gameTopImgElement) {
        gameTopImgElement.src = game.thumbnail;
        gameTopImgElement.alt = `Thumbnail for ${game.title}`;
    } else {
        console.error('Element with data-type "Games__cards_top_img" not found');
    }

    const gameTitleElement = clone.querySelector('[data-type="Games__cards_top_text_title"]');
    if (gameTitleElement) {
        gameTitleElement.textContent = game.title;
    } else {
        console.error('Element with data-type "Games__cards_top_text_title" not found');
    }

    const gameDescriptionElement = clone.querySelector('[data-type="Games__cards_top_text_p"]');
    if (gameDescriptionElement) {
        gameDescriptionElement.textContent = `Description: ${game.short_description.substring(0, 40)}...`;
    } else {
        console.error('Element with data-type "Games__cards_top_text_p" not found');
    }

    const genreElement = clone.querySelector('[data-card-genre]');
    if (genreElement) {
        genreElement.textContent = `Genre: ${game.genre}`;
    }

    const platformElement = clone.querySelector('[data-card-platform]');
    if (platformElement) {
        platformElement.textContent = `Platform: ${game.platform}`;
    }

    const publisherElement = clone.querySelector('[data-card-publisher]');
    if (publisherElement) {
        publisherElement.textContent = `Publisher: ${game.publisher}`;
    }

    const developerElement = clone.querySelector('[data-card-developer]');
    if (developerElement) {
        developerElement.textContent = `Developer: ${game.developer}`;
    }

    const releaseDateElement = clone.querySelector('[data-card-release-date]');
    if (releaseDateElement) {
        releaseDateElement.textContent = `Release Date: ${game.release_date}`;
    }

    return clone;
}

function highlightText(element, searchText) {
    const { innerHTML } = element;
    const lowerCaseInnerHTML = innerHTML.toLowerCase();
    const lowerCaseSearchText = searchText.toLowerCase();

    element.innerHTML = innerHTML.replace(/<\/mark>/g, '').replace(/<mark>/g, '');

    let index = lowerCaseInnerHTML.indexOf(lowerCaseSearchText);

    while (index !== -1) {
        const start = innerHTML.substring(0, index);
        const match = innerHTML.substring(index, index + searchText.length);
        const end = innerHTML.substring(index + searchText.length);

        element.innerHTML = `${start}<mark>${match}</mark>${end}`;

        index = lowerCaseInnerHTML.indexOf(lowerCaseSearchText, index + 1);
    }
}

function renderGames(games) {
    const cardContainer = document.querySelector('[data-type="card-container"]');

    if (!cardContainer) {
        console.error('Card container not found');
        return;
    }

    const searchText = document.getElementById('search').value.toLowerCase();

    cardContainer.innerHTML = '';

    console.log('Rendered games:', games); // Додайте цей рядок для логування

    games.forEach((game) => {
        const cardElement = createCardElement(game);
        if (cardElement) {
            cardContainer.appendChild(cardElement);

            const elementsToHighlight = cardElement.querySelectorAll('[data-card-genre], [data-type="Games__cards_top_text_title"], [data-type="Games__cards_top_text_p"]');

            elementsToHighlight.forEach((element) => {
                highlightText(element, searchText);
            });
        }
    });
}

function filterGames() {
    const filterForm = document.getElementById('filterForm');
    const searchTextElement = document.getElementById('search');

    filterForm.addEventListener('change', () => {
        const isNewChecked = document.getElementById('new_games').checked;
        const isOldChecked = document.getElementById('old_games').checked;
        const selectedGenre = document.getElementById('game_properties').value;

        const searchText = searchTextElement.value.toLowerCase();

        try {
            const filteredGames = gamesData.filter((game) => {
                const isNewMatch = isNewChecked && game.isNew;
                const isOldMatch = isOldChecked && !game.isNew;
                const genreMatch = selectedGenre === 'Genre' || game.genre === selectedGenre;
                const titleMatch = game.title.toLowerCase().includes(searchText);
                const descriptionMatch = game.short_description.toLowerCase().includes(searchText);

                return (isNewMatch || isOldMatch) && genreMatch && (titleMatch || descriptionMatch);
            });

            renderGames(filteredGames);

            const cardElements = document.querySelectorAll('.card-template');
            cardElements.forEach((cardElement) => {
                const elementsToHighlight = cardElement.querySelectorAll('[data-card-genre], [data-type="Games__cards_top_text_title"], [data-type="Games__cards_top_text_p"]');
                elementsToHighlight.forEach((element) => {
                    highlightText(element, searchText);
                });
            });
        } catch (error) {
            console.error('Error filtering games:', error);
        }
    });

    searchTextElement.addEventListener('input', () => {
        const searchText = searchTextElement.value.toLowerCase();

        try {
            const cardElements = document.querySelectorAll('[data-type="card-template"]');
            cardElements.forEach((cardElement) => {
                const elementsToHighlight = cardElement.querySelectorAll('[data-card-genre], [data-type="Games__cards_top_text_title"], [data-type="Games__cards_top_text_p"]');
                elementsToHighlight.forEach((element) => {
                    highlightText(element, searchText);
                });
            });
        } catch (error) {
            console.error('Error highlighting text:', error);
        }
    });
}

function init() {
    renderGames(gamesData);
    filterGames();

    const applyButton = document.getElementById('apply');

    applyButton.addEventListener('click', () => {
        try {
            filterGames();
        } catch (error) {
            console.error('Error applying filter:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', init);