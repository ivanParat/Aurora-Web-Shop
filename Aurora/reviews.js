const reviewContainersList = document.getElementsByClassName('reviewContainer');
const signInEnterButton = document.getElementById("signInEnter");
const signUpEnterButton = document.getElementById("signUpEnter");
const logOutButton=document.getElementById("logOutBtn");

let activeUser;
function getActiveUser(){
    activeUser=JSON.parse(sessionStorage.getItem('user'));
    console.log("activeUser:", activeUser);
}
getActiveUser();

signInEnterButton.addEventListener('click', function(){
    getActiveUser();
    checkReviewContainersForUserReview();
});
signUpEnterButton.addEventListener('click', function(){
    getActiveUser();
    checkReviewContainersForUserReview();
});

// for some reason doesn't work, so I added the functions directly in HTML (onlick="...")
// logOutButton.addEventListener('click', function(){
//     getActiveUser();
//     checkReviewContainersForUserReview();
// });

const fetchProductReviewData = async (query, productName) => {
    try {
        const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, values: [productName] }),
        });
    
        const data = await response.json();
        return data.data;
        
    }catch (error) {
      console.error('Error fetching data:', error);
    }
};

const insertReviewData = async (query, activeUserEmail, productName, rating) => {
    try {
        const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, values: [activeUserEmail, productName, rating] }),
        });
        
        if (!response.ok) {
            // If the server returns an error status code (e.g., 4xx or 5xx),
            // throw an error with the status text.
            throw new Error(`Server returned ${response.status} - ${response.statusText}`);
        }
      
        const responseData = await response.json();
        if (responseData.success) {
        console.log('Review data inserted successfully:', responseData.data);
        } else {
        console.error('Failed to insert review data:', responseData.error);
        }
        
    }catch (error) {
      console.error('Error inserting data:', error);
    }
};

const deleteReviewData = async (query, activeUserEmail, productName) => {
    try {
        const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, values: [activeUserEmail, productName] }),
        });
        
        if (!response.ok) {
            // If the server returns an error status code (e.g., 4xx or 5xx),
            // throw an error with the status text.
            throw new Error(`Server returned ${response.status} - ${response.statusText}`);
        }
      
        const responseData = await response.json();
        if (responseData.success) {
        console.log('Review data deleted successfully:', responseData.data);
        } else {
        console.error('Failed to delete review data:', responseData.error);
        }
        
    }catch (error) {
      console.error('Error deleting data:', error);
    }
};

const updateAvgRatingOfProduct = async(reviewContainer) => {
    productName=reviewContainer.parentElement.querySelector('.productName').innerHTML;

    const avgRatingContainer = reviewContainer.querySelector('.avgRating');
    let avgRating;

    const starsContainer = reviewContainer.querySelector('.stars');

    const numberOfReviewsContainer = reviewContainer.querySelector('.numberOfReviews');
    let numberOfReviews;

    const reviewDataQuery = `SELECT product.id AS product_id, product.name AS product_name, AVG(review.rating) AS average_rating, COUNT(*) AS total_reviews FROM product JOIN review ON product.id = review.product_id WHERE product.id = (SELECT id FROM product WHERE product.name=$1) GROUP BY product.id`;

    const queryResult=await fetchProductReviewData(reviewDataQuery, productName);
    if(queryResult){//if there are any reviews at all
        avgRating=Number(queryResult[0].average_rating);
        numberOfReviews=Number(queryResult[0].total_reviews);
        if(avgRating){
            avgRatingContainer.innerHTML = avgRating.toFixed(1);
        }
        if(numberOfReviews){
            numberOfReviewsContainer.innerHTML = `(${numberOfReviews})`;
        }
    }
    const stars = starsContainer.children;
    for (let j = 0; j < stars.length; j++) {
        console.log(avgRating);
        stars[j].classList.remove('active');
        stars[j].classList.toggle('alreadyReviewed', (j+1) <= Math.round(avgRating));
    }
}

const insertReviewIntoDatabase = async(activeUser, productName, rating, reviewContainer) => {
    let queryDelete = 'DELETE FROM review WHERE user_id=(SELECT id FROM aurorauser WHERE email=$1) AND product_id=(SELECT id FROM product WHERE name=$2)';
    await deleteReviewData(queryDelete, activeUser.email, productName);


    let queryInsert = `INSERT INTO review (user_id, product_id, rating) SELECT (SELECT id FROM aurorauser WHERE email=$1), (SELECT id FROM product WHERE name=$2), $3`;

    await insertReviewData(queryInsert, activeUser.email, productName, rating);

    await updateAvgRatingOfProduct(reviewContainer);
}

const handleStarClick = async(event, i, productName) => {
    const clickedRating = event.target.getAttribute('data-rating');
    const starsContainer = reviewContainersList[i].querySelector('.stars');
    
    if(activeUser){
        // Mark the clicked star and stars before it as alreadyReviewed
        const stars = starsContainer.children;
        for(let j=0; j<stars.length; j++){
            const rating = stars[j].getAttribute('data-rating');
            stars[j].classList.remove('active');
            stars[j].classList.toggle('alreadyReviewed', rating <= clickedRating);
        }
        await insertReviewIntoDatabase(activeUser, productName, clickedRating, reviewContainersList[i]);
    }
}

const initReviewContainers = async () => {
    for(let i=0; i<reviewContainersList.length; i++){
        productName=reviewContainersList[i].parentElement.querySelector('.productName').innerHTML;

        const avgRatingContainer = reviewContainersList[i].querySelector('.avgRating');
        let avgRating;

        const starsContainer = reviewContainersList[i].querySelector('.stars');

        const numberOfReviewsContainer = reviewContainersList[i].querySelector('.numberOfReviews');
        let numberOfReviews;


        const reviewDataQuery = `SELECT product.id AS product_id, product.name AS product_name, AVG(review.rating) AS average_rating, COUNT(*) AS total_reviews FROM product JOIN review ON product.id = review.product_id WHERE product.id = (SELECT id FROM product WHERE product.name=$1) GROUP BY product.id`;

        const queryResult=await fetchProductReviewData(reviewDataQuery, productName);
        if(queryResult){//if there are any reviews at all
            avgRating=Number(queryResult[0].average_rating);
            numberOfReviews=Number(queryResult[0].total_reviews);
            if(avgRating){
                avgRatingContainer.innerHTML = avgRating.toFixed(1);
            }
            if(numberOfReviews){
                numberOfReviewsContainer.innerHTML = `(${numberOfReviews})`;
            }
        }

        // Create stars dynamically
        for (let j = 1; j <= 5; j++) {
            const star = document.createElement('span');
            star.innerHTML = '★'; // Unicode star character
            star.setAttribute('data-rating', j); //j is the ordinal number of star

            // Create a closure to capture the correct values for i and productName
            const createEventListener = (index, name) => async (event) => {
                await handleStarClick(event, index, name);
            };
            star.addEventListener('click', createEventListener(i, productName));

            star.classList.toggle('active', j <= Math.round(avgRating));
            starsContainer.appendChild(star);
        }
    }
}

const checkReviewContainersForUserReview = async () => {
    for(let i=0; i<reviewContainersList.length; i++){
        productName=reviewContainersList[i].parentElement.querySelector('.productName').innerHTML;

        const avgRatingContainer = reviewContainersList[i].querySelector('.avgRating');
        let avgRating;

        const starsContainer = reviewContainersList[i].querySelector('.stars');

        const numberOfReviewsContainer = reviewContainersList[i].querySelector('.numberOfReviews');
        let numberOfReviews;

        let reviewDataQuery;
        if(activeUser){
            reviewDataQuery = `SELECT product.id AS product_id, product.name AS product_name, aurorauser.id AS user_id, aurorauser.email AS user_email,review.rating FROM product JOIN review ON product.id = review.product_id JOIN aurorauser ON aurorauser.id=review.user_id WHERE product.id = (SELECT id FROM product WHERE product.name=$1)`;
        }
        else{
            reviewDataQuery = `SELECT product.id AS product_id, product.name AS product_name, AVG(review.rating) AS average_rating, COUNT(*) AS total_reviews FROM product JOIN review ON product.id = review.product_id WHERE product.id = (SELECT id FROM product WHERE product.name=$1) GROUP BY product.id`;
        }

        const queryResult = await fetchProductReviewData(reviewDataQuery, productName);

        if(activeUser){
            if(queryResult){//if the product has any reviews
                let hasUserReviewed = false;
                let userRating;
                for(let j=0; j<queryResult.length; j++){//iterating through reviews of a single product
                    if(queryResult[j].user_email==activeUser.email){
                        hasUserReviewed=true;
                        userRating=Number(queryResult[j].rating);
                    }
                }
                if(hasUserReviewed==true){
                    const stars = starsContainer.children;
                    for (let j = 0; j < stars.length; j++) {
                        stars[j].classList.remove('active');
                        stars[j].classList.toggle('alreadyReviewed', (j+1) <= userRating);
                    }
                }
            }
        }
        else{
            if(queryResult){//if there are any reviews at all
                avgRating=Number(queryResult[0].average_rating);
                numberOfReviews=Number(queryResult[0].total_reviews);
                if(avgRating){
                    avgRatingContainer.innerHTML = avgRating.toFixed(1);
                }
                if(numberOfReviews){
                    numberOfReviewsContainer.innerHTML = `(${numberOfReviews})`;
                }
            }
            const stars = starsContainer.children;
            for (let j = 0; j < stars.length; j++) {
                stars[j].classList.remove('alreadyReviewed');
                stars[j].classList.toggle('active', (j+1) <= Math.round(avgRating));
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
        // Get the current pathname
        let currentPathname = window.location.pathname;
         // Split the pathname into an array using '/' as the separator
        let pathSegments = currentPathname.split('/');
        // Get the last segment of the path
        let lastPathSegment = pathSegments[pathSegments.length - 1];
        if(lastPathSegment=='search.html'){//if we are on search.html, we want to run searchProducts(), but not otherwise
            await searchProducts();
        }
        await initReviewContainers();
        await checkReviewContainersForUserReview();
    }
);
