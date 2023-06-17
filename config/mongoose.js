const mongoose = require('mongoose');

dbURI = "mongodb+srv://akshit:EOc8qrRevo5AQEPg@cluster0.q7lvpga.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect('mongodb://localhost/sociocall_development');
mongoose.connect(dbURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function() {
    console.log('Connected to DB :: MongoDB');
});

module.exports = db