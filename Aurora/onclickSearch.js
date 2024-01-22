const searchBtn = document.getElementsByClassName("search-button")[0];
const searchBtnMobile = document.getElementsByClassName("search-button-mobile")[0];
const searchInput = document.getElementsByClassName("search-input")[0];
const searchInputMobile = document.getElementsByClassName("search-input-mobile")[0];

//adding user's search to session storage, so that it's readable when we go to search.html
function addToSessionStorage(input) {
    sessionStorage.removeItem('search');//remove old search
    sessionStorage.setItem('search', input);//add new search
}

//delaying going to search.html a little bit, so that there's enough time to save the search into session storage
function navigateWithDelay(href, input) {
    
    addToSessionStorage(input); 
    
    // Navigate to the new page after a delay
    setTimeout(function () {
        window.location.href = href;
    }, 500);
}

searchBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    navigateWithDelay('search.html', searchInput.value);
});

searchBtnMobile.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    navigateWithDelay('search.html', searchInputMobile.value);
});
