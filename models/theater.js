// models/theater.js
const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);