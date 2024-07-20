const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const db = require('./db'); // Ensure this points to the correct path of your db module

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());
app.use('/api', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
