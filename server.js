const express = require('express');
const path = require('path')
const api = require('./routes/index.js');

// Looks for a port number specific to the environment. If not, defaults to 3001
const PORT = process.env.PORT || 3001;

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => 
    console.log(`Server listening at ${PORT}`)
)