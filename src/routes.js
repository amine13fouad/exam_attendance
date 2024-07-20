const express = require('express');
const router = express.Router();
const db = require('./db'); // Ensure this points to the correct path of your db module

// GET surveillant by email and mdp
router.get('/surveillant', async (req, res) => {
    const { email, mdp } = req.query;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM surveillant WHERE email = ? AND mdp = ?',
            [email, mdp]
        );

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).send('Surveillant not found');
        }
    } catch (error) {
        console.error('Error fetching surveillant:', error);
        res.status(500).send('Server error');
    }
});

// GET all surveillants
router.get('/surveillants', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM surveillant');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching surveillants:', error);
        res.status(500).send('Server error');
    }
});

// GET etudiant by id
router.get('/etudiant/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.execute('SELECT * FROM etudiant WHERE id_etudiant = ?', [id]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching etudiant:', err);
        res.status(500).send('Server error');
    }
});

// GET all locals
router.get('/locals', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM local');
        res.json(results);
    } catch (err) {
        console.error('Error fetching locals:', err);
        res.status(500).send('Server error');
    }
});

// GET all presence_surveillant
router.get('/presence_surveillant', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM presence_surveillant');
        res.json(results);
    } catch (err) {
        console.error('Error fetching presence_surveillant:', err);
        res.status(500).send('Server error');
    }
});

// POST presence_surveillant if not already inserted
router.post('/presence_surveillant', async (req, res) => {
    const { id_surveillant, date, heure, matiere, local } = req.body;
    try {
        const [results] = await db.execute(
            'SELECT * FROM presence_surveillant WHERE id_surveillant = ? AND date = ? AND heure = ? AND matiere = ? AND local = ?',
            [id_surveillant, date, heure, matiere, local]
        );

        if (results.length > 0) {
            return res.status(400).send('Already exists');
        }

        await db.execute(
            'INSERT INTO presence_surveillant (id_surveillant, date, heure, matiere, local) VALUES (?, ?, ?, ?, ?)',
            [id_surveillant, date, heure, matiere, local]
        );
        res.status(201).send('Inserted');
    } catch (err) {
        console.error('Error inserting presence_surveillant:', err);
        res.status(500).send('Server error');
    }
});

// GET all exams
router.get('/exams', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM exam');
        res.json(results);
    } catch (err) {
        console.error('Error fetching exams:', err);
        res.status(500).send('Server error');
    }
});

// GET exams by matiere
router.get('/exams/matiere/:matiere', async (req, res) => {
    const { matiere } = req.params;
    try {
        const [results] = await db.execute('SELECT * FROM exam WHERE matiere = ?', [matiere]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching exams by matiere:', err);
        res.status(500).send('Server error');
    }
});

// GET exams by id_etudiant
router.get('/exams/etudiant/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.execute('SELECT * FROM exam WHERE id_etudiant = ?', [id]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching exams by etudiant:', err);
        res.status(500).send('Server error');
    }
});

// PUT to modify presence from 0 to 1
router.put('/exams/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE exam SET presence = 1 WHERE id_exam = ?', [id]);
        res.send('Updated');
    } catch (err) {
        console.error('Error updating exam presence:', err);
        res.status(500).send('Server error');
    }
});

// POST to add student if not found
router.post('/exams', async (req, res) => {
    const { id_etudiant, matiere, local, date, heure, presence } = req.body;
    try {
        const [results] = await db.execute(
            'SELECT * FROM exam WHERE id_etudiant = ? AND matiere = ? AND local = ? AND date = ? AND heure = ?',
            [id_etudiant, matiere, local, date, heure]
        );

        if (results.length > 0) {
            return res.status(400).send('Already exists');
        }

        await db.execute(
            'INSERT INTO exam (id_etudiant, matiere, local, date, heure, presence) VALUES (?, ?, ?, ?, ?, ?)',
            [id_etudiant, matiere, local, date, heure, presence]
        );
        res.status(201).send('Inserted');
    } catch (err) {
        console.error('Error inserting exam:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
