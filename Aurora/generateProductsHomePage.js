const { connectToDatabase, disconnectFromDatabase, getDataFromDatabase, insertDataIntoDatabase } = require('./getProducts');
const fs = require('fs');
const ejs = require('ejs');

//shuffles an array randomly
function getRandomElements(arr, n) {
   const shuffledArray = arr.sort(() => Math.random() - 0.5);
 
   const selectedElements = shuffledArray.slice(0, n);
 
   return selectedElements;
 }

async function generateHTMLContent() {
  try {
   // Connect to the database
   await connectToDatabase();

   const query = `SELECT * FROM product`;
   const data = await getDataFromDatabase(query);

   if (data.length > 0) {
      //get random products
      randomizedData=getRandomElements(data, 16);

      // Read the EJS template from a file (index-template.ejs)
      const template = fs.readFileSync('index-template.ejs', 'utf8');

      // Render the template with the array of employees
      const htmlContent = ejs.render(template, { products: randomizedData });
      
      // Write the rendered HTML content to a file (index.html)
      fs.writeFileSync(`index.html`, htmlContent);

      console.log('HTML content generated');
   } else {
      console.log('Data not found');
   }
  } catch (error) {
    console.error('Error generating HTML content', error);
  } finally {
    // Disconnect from the database
    await disconnectFromDatabase();
  }
}

// Call the function to generate HTML content
generateHTMLContent();