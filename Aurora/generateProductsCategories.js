const { connectToDatabase, disconnectFromDatabase, getDataFromDatabase, insertDataIntoDatabase} = require('./getProducts');
const fs = require('fs');
const ejs = require('ejs');

async function generateHTMLContent() {
  try {
    // Connect to the database
    await connectToDatabase();

    const categories = await getDataFromDatabase('SELECT name FROM category');
    for(i=0; i < categories.length; i++)
    {
      const categoryName = categories[i].name;
      const query = `SELECT * FROM product WHERE category_id=(SELECT id FROM category WHERE name = '${categoryName}')`;
      const data = await getDataFromDatabase(query);

      if (data.length > 0) {
        // Read the EJS template from a file (category-template.ejs)
        const template = fs.readFileSync('category-template.ejs', 'utf8');

        // Render the template with the array of products
        const htmlContent = ejs.render(template, { products: data });
        
        // Write the rendered HTML content to a file 
        fs.writeFileSync(`${categoryName.toLowerCase()}.html`, htmlContent);

        console.log('HTML content generated');
      } else {
        console.log('Data not found');
      }
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