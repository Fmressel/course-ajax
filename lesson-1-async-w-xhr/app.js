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
        const data = JSON.parse(this.responseText),
            firstImage = data.results[0];

        console.log(firstImage);

        htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedText}">
            <figcaption>${searchedText} by ${firstImage.user.name}</figcaption>
        </figure>`;

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        makeUnsplashRequest(searchField.value);
    });
})();
