const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Aurora',
  password: 'marko12345',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/query', async (req, res) => {
  const { query, values } = req.body;

  console.log('Received query:', query);
  console.log('Received values:', values);

  try {
    let result;

    if (values) {
      result = await pool.query(query, values);
    } else {
      result = await pool.query(query);
    }

    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, message: 'No data found.' });
    }
  } catch (error) {
    console.error('Error executing query in PostgreSQL:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
