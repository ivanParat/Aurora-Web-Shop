const featuredProductsContainer=document.getElementsByClassName('featuredProductsContainer')[0];

const search=sessionStorage.getItem('search');

let productList = [];
let searchedProductList = [];

function simpleStringSearch(text, pattern) {
    const lowerText = text.toLowerCase();
    const lowerPattern = pattern.toLowerCase();

    const textLength = lowerText.length;
    const patternLength = lowerPattern.length;

    for (let i = 0; i <= textLength - patternLength; i++) {
    if (lowerText.substring(i, i + patternLength) === lowerPattern) {
        return i; // pattern found at index i in the text
    }
    }

    return -1; // pattern not found
}

function generateHTMLContent(){
  searchedProductList.forEach(product => {
    let productCard = document.createElement('div');
    productCard.className = 'productCard';
    productCard.innerHTML = `
      <div class="imageContainer">
        <img src=${product.imagesrc} class="productImage"/>
      </div>
      <div class="productBrand">${product.brand}</div>
      <div class="productName">${product.name}</div>
      <div class="priceAndCartContainer">
        <div class="productPrice">${product.price}</div>
        <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/shopping_cart.png" class="shoppingCartIcon"/>
      </div>
    `;
    featuredProductsContainer.appendChild(productCard);
  });
  featuredProductsContainer.style.marginTop="90px";

  //this is to ensure there is no empty space below footer
  document.body.style.minHeight="100vh";
  document.body.style.display="flex";
  document.body.style.flexDirection="column";
  document.getElementsByTagName('footer')[0].style.marginTop="auto";
}

const fetchProductData = async (query) => {
  try {
    const response = await fetch('http://localhost:3000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    // Process the data as needed
    data.data.forEach(element => {
      productList.push(element);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const productDataQuery = "SELECT product.name AS name, product.brand, product.price, category.name AS category,product.imageSrc FROM product INNER JOIN category ON product.category_id=category.id";

const searchProducts = async () => {
  await fetchProductData(productDataQuery);
  productList.forEach(product => {
    if(simpleStringSearch(product.name, search)!=-1 || simpleStringSearch(product.brand, search)!=-1 || simpleStringSearch(product.category, search)!=-1){
        searchedProductList.push(product);
    }
  });
  console.log("Searched products:",searchedProductList);
  generateHTMLContent();
};

searchProducts();
