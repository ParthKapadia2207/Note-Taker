
const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid')

// GET route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE route for deleting a specific note by id
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => {
            let allNotes = JSON.parse(data);
            const updatedNotes = allNotes.filter(note => note.id !== noteId);

            if (allNotes.length === updatedNotes.length) {
                res.status(404).send('Note not found');
            } else {
                writeToFile('./db/db.json', updatedNotes)
                    .then(() => {
                        res.json({ message: 'Note deleted successfully' });
                    })
                    .catch((err) => {
                        res.status(500).send('Error deleting note');
                    });
            }
        })
        .catch((err) => {
            res.status(500).send('Error reading notes');
        });
});

// POST Route for adding a note
notes.post('/', (req, res) => {
    console.info(`${req.method} request receieved to add note`)
    // Destructuring Notes
    const { title, text } = req.body;

    // Check if there is a title and text
    if (title && text) {
        const newNote = {
            title, 
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        }
        res.json(response);
    } else {
        res.json('Error in adding Note')
    }
});

module.exports = notes;
