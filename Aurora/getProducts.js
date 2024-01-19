const { Client } = require('pg');

const username='postgres';
const password='pswdaur';
const databaseName='aurora';

const connectionString = `postgresql://${username}:${password}@localhost:5432/${databaseName}`;
const client = new Client({
  connectionString: connectionString,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

async function disconnectFromDatabase() {
  try {
    await client.end();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database', error);
  }
}

async function getDataFromDatabase(query) {
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching data from the database', error);
  }
}

//not used 
async function insertDataIntoDatabase(query, values) {
  try {
    const result = await client.query(query, values);
    return result;
  } catch (error) {
    console.error('Error inserting data into the database', error);
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getDataFromDatabase,
  insertDataIntoDatabase,
};