const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aurora',
  password: 'pswdaur',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.get('/getData', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aurorauser');
    const data = result.rows;
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from PostgreSQL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/submit', async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      const result = await pool.query('INSERT INTO aurorauser (username, email, password) VALUES ($1, $2, $3) RETURNING *', [email, username, password]);
      const insertedData = result.rows[0];
      res.json({ success: true, data: insertedData });
    } catch (error) {
      console.error('Error inserting data into PostgreSQL:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
