// Define the shoppingCart array and retrieve it from localStorage
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

if (window.location.pathname.includes('index.html')||
    window.location.pathname.includes('clothes.html')||
    window.location.pathname.includes('electronics.html')||
    window.location.pathname.includes('other.html')||
    window.location.pathname.includes('search.html')||
    window.location.pathname.includes('tools.html')||
    window.location.pathname.includes('toys.html')||
    window.location.pathname.includes('aboutus.html')
) {
  shoppingCart = [];
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}
// Function to handle the click event on shopping cart icons
function addToCart(event) {
    // Get the parent product card of the clicked icon
    const productCard = event.target.closest('.productCard');

    // Extract information from the product card
    const image = productCard.querySelector('.productImage').src;
    const brand = productCard.querySelector('.productBrand').textContent;
    const name = productCard.querySelector('.productName').textContent;
    const price = productCard.querySelector('.productPrice').textContent;

    // Create an object with the extracted information
    const productObject = {
        image: image,
        brand: brand,
        name: name,
        price: price,
    };

    // Add the product object to the shopping cart array
    shoppingCart.push(productObject);

    // Save the updated shopping cart array to localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

    updateCartLink();
    // You can log the shopping cart array to the console (for testing)
    console.log(shoppingCart);
}

// Function to update the cart link based on the shopping cart content
function updateCartLink() {
    const cartLink = document.getElementById('cartLink');
    const cartLinkText = cartLink.querySelector('.link__text');

    if (shoppingCart.length > 0) {
        cartLinkText.textContent = `Cart (${shoppingCart.length})`;
        // Add a click event listener to navigate to the cart page
        cartLink.addEventListener('click', function (event) {
            event.preventDefault();  // Stop the default behavior
            window.location.href = 'cart.html';
        });
    } else {
        cartLinkText.textContent = 'Cart';
    }
}

// Attach click event listeners to all elements with class "shoppingCartIcon"
const shoppingCartIcons = document.querySelectorAll('.shoppingCartIcon');
shoppingCartIcons.forEach(icon => {
    icon.addEventListener('click', addToCart);
});
