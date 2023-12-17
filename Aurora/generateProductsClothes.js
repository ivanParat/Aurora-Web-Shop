//importing product data grouped by category
import { fetchData } from './products.js';

async function processData() {
   try {
      const groupedProducts = await fetchData();
      
      const featuredProductsContainer=document.getElementsByClassName('featuredProductsContainer')[0];
      const productCardFeaturedProducts=document.getElementsByClassName('productCard')[0];
      
      const newArrivalsContainer=document.getElementsByClassName('newArrivalsContainer')[0];
      const productCardNewArrivals=document.getElementsByClassName('productCard')[1];

      //setting the product values to the productCard already inside of featuredProductsContainer
      productCardFeaturedProducts.querySelector('.imageContainer').querySelector('.productImage').src=groupedProducts.Clothes[0].imageSrc;
      productCardFeaturedProducts.querySelector('.productBrand').innerHTML=groupedProducts.Clothes[0].brand;
      productCardFeaturedProducts.querySelector('.productName').innerHTML=groupedProducts.Clothes[0].name;
      productCardFeaturedProducts.querySelector('.priceAndCartContainer').querySelector('.productPrice').innerHTML="€"+groupedProducts.Clothes[0].price;

      //setting the product values to the productCard already inside of newArrivalsContainer
      productCardNewArrivals.querySelector('.imageContainer').querySelector('.productImage').src=groupedProducts.Clothes[8].imageSrc;
      productCardNewArrivals.querySelector('.productBrand').innerHTML=groupedProducts.Clothes[8].brand;
      productCardNewArrivals.querySelector('.productName').innerHTML=groupedProducts.Clothes[8].name;
      productCardNewArrivals.querySelector('.priceAndCartContainer').querySelector('.productPrice').innerHTML="€"+groupedProducts.Clothes[8].price;

      for(i=1;i<8;i++){
         //cloning product card already inside of featuredProductsContainer to make more cards and setting appropriate product values
         const productCardClone=productCardFeaturedProducts.cloneNode(true);
         productCardClone.querySelector('.imageContainer').querySelector('.productImage').src=groupedProducts.Clothes[i].imageSrc;
         productCardClone.querySelector('.productBrand').innerHTML=groupedProducts.Clothes[i].brand;
         productCardClone.querySelector('.productName').innerHTML=groupedProducts.Clothes[i].name;
         productCardClone.querySelector('.priceAndCartContainer').querySelector('.productPrice').innerHTML="€"+groupedProducts.Clothes[i].price;
         featuredProductsContainer.appendChild(productCardClone);
      }

      for(i=9;i<16;i++){
         //cloning product card already inside of newArrivalsContainer to make more cards and setting appropriate product values
         const productCardClone=productCardNewArrivals.cloneNode(true);
         productCardClone.querySelector('.imageContainer').querySelector('.productImage').src=groupedProducts.Clothes[i].imageSrc;
         productCardClone.querySelector('.productBrand').innerHTML=groupedProducts.Clothes[i].brand;
         productCardClone.querySelector('.productName').innerHTML=groupedProducts.Clothes[i].name;
         productCardClone.querySelector('.priceAndCartContainer').querySelector('.productPrice').innerHTML="€"+groupedProducts.Clothes[i].price;
         newArrivalsContainer.appendChild(productCardClone);
      }
   } catch (error) {
       // Handle errors if needed
      console.error('Error processing data:', error);
   }
}

processData();