const { mongoURI, clientURI } = require('./config/keys');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Cors
const origin = clientURI || 'http://localhost:3000';
const cors = require('cors');

const corsOptions = { origin: origin, credentials: true };

// Initialize Server
const server = express();

// Middleware
server.use(express.json());
server.use(cors(corsOptions));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Passport Middleware
server.use(passport.initialize());

// Initialize PORT
const PORT = process.env.PORT || 5000;

// Use Routes
server.put('/api/:id', (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: 'Success' });
});

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  server.use(express.static('client/build'));
  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(PORT, err => {
  if (err) console.error(err);
  console.log(`Server running on port: ${PORT}`);
});