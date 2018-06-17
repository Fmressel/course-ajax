(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');

    const responseContainer = document.querySelector('#response-container');
    let searchedText = '';

    const unsplashRequest = new XMLHttpRequest();
    const makeUnsplashRequest = (searchTerm) => {
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchTerm}`);
        unsplashRequest.onload = addImage;
        // Passing your API keys to the client is not advised. But is the most straight forward way of dealing with this setup right now.
        unsplashRequest.setRequestHeader('Authorization', `Client-ID ${API_HELPER.unsplashKey}`);
        unsplashRequest.send();
        searchedText = searchTerm;
    }

    const addImage = function () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data && data.results && data.results[0]) {
            const firstImage = data.results[0];

            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedText}">
                <figcaption>${searchedText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = `<h3 class="error-no-image">No images available!</h3>`
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    };

    const articleRequest = new XMLHttpRequest();
    const makeArticleRequest = (searchTerm) => {
        articleRequest.onload = addArticles;
        // Passing your API keys to the client is not advised. But is the most straight forward way of dealing with this setup right now.
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${API_HELPER.timesKey}`);
        articleRequest.send();
    }

    const addArticles = function () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map((article) => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = `<h3 class="error-no-articles">No articles available!</h3>`
        }

        responseContainer.insertAdjacentHTML('afterend', htmlContent);
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        makeUnsplashRequest(searchField.value);
        makeArticleRequest(searchField.value);
    });
})();
