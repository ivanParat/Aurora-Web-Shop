class product{
    constructor(name, brand, price, category, imageSrc){
        this.name=name;
        this.brand=brand;
        this.price = parseFloat(price).toFixed(2);
        this.category=category;
        this.imageSrc=imageSrc;
    }
}

//getting data from products.json and grouping it by category
async function fetchData() {
    try {
        const response = await fetch('./products.json');
        const data = await response.json();

        const products = data.map(productData => new product(
            productData.name,
            productData.brand,
            productData.price,
            productData.category,
            productData.imageSrc
        ));

        const groupedProducts = products.reduce((result, product) => {
            if (!result[product.category]) {
                result[product.category] = [];
            }
            result[product.category].push(product);
            return result;
        }, {});
        return groupedProducts;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        throw error; // Rethrow the error to be handled elsewhere if needed
    }
}
//exporting the data so it is visible to other .js files
export { fetchData };