const featuredProductsContainer=document.getElementsByClassName('featuredProductsContainer')[0];
const productCard=document.getElementsByClassName('productCard')[0];
for(i=0;i<7;i++){
   const proudctCardClone=productCard.cloneNode(true);
   featuredProductsContainer.appendChild(proudctCardClone);
}

const newArrivalsContainer=document.getElementsByClassName('newArrivalsContainer')[0];
for(i=0;i<7;i++){
    const proudctCardClone=productCard.cloneNode(true);
    newArrivalsContainer.appendChild(proudctCardClone);
 }