const express = require('express');
const axios = require('axios');
//const cors = require('cors');
const morgan = require('morgan')
const path = require('path')
const PORT = 4040;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
