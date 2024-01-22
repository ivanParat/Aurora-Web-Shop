// Retrieve the shopping cart array from localStorage
const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];


// Function to render the products in the shopping cart
function renderCartProducts() {
    const cartContainer = document.getElementById('cartContainer');

    if (shoppingCart.length === 0) {
        // If the shopping cart is empty, display a message
        cartContainer.innerHTML = '<p>Your shopping cart is empty.</p>';
    } else {
        // If there are products in the shopping cart, render them
        const productsHTML = shoppingCart.map(product => `
            <div class="productCard">
                <img src="${product.image}" alt="${product.name}" class="imageContainer" />
                <div class="cartProductDetails">
                    <div class="productBrand">${product.brand}</div>
                    <div class="productName">${product.name}</div>
                    <div class="priceAndCartContainer">${product.price}</div>
                </div>
            </div>
        `).join('');

        cartContainer.innerHTML = productsHTML;
    }
}
function calculateTotalSum() {
  return shoppingCart.reduce((sum, product) => sum + parseFloat(product.price.replace('€', '')), 0).toFixed(2);
}
const totalSumElement = document.getElementById('totalSum');
totalSumElement.textContent = `Total Price: €${calculateTotalSum()}`;

// Call the function to render the cart products when the page loads
document.addEventListener('DOMContentLoaded', renderCartProducts);
