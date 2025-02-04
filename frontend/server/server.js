const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Baza danych SQLite
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err.message);
  } else {
    console.log('Połączono z bazą danych SQLite');
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Umożliwia parsowanie JSON-a

// Tworzenie tabeli, jeśli jeszcze nie istnieje
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      project TEXT,
      start_time TEXT,
      end_time TEXT,
      total_time TEXT,
      date TEXT
    );
  `);
});

// Endpoint do pobierania zadań
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint do zapisywania zadania
app.post('/tasks', (req, res) => {
  const { description, project, start_time, end_time, total_time, date } = req.body;
  const query = `
    INSERT INTO tasks (description, project, start_time, end_time, total_time, date)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  db.run(query, [description, project, start_time, end_time, total_time, date], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});
// Endpoint do usuwania zadania
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tasks WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Task deleted successfully" });
    }
  });
});
// Endpoint do edytowania zadania
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description, project, start_time, end_time, date } = req.body;

  // Oblicz nowy czas trwania
  const startDate = new Date(`${date} ${start_time}`);
  const endDate = new Date(`${date} ${end_time}`);
  const durationInSeconds = Math.floor((endDate - startDate) / 1000);

  // Zaokrąglenie w górę do pełnej minuty
  const roundedDurationInMinutes = Math.ceil(durationInSeconds / 60);

  const hours = Math.floor(roundedDurationInMinutes / 60);
  const minutes = roundedDurationInMinutes % 60;

  const total_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const query = `UPDATE tasks SET description = ?, project = ?, start_time = ?, end_time = ?, total_time = ? WHERE id = ?`;

  db.run(query, [description, project, start_time, end_time, total_time, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id, description, project, start_time, end_time, total_time, date });
    }
  });
});



// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});