const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    genre: String
});

module.exports = mongoose.model('Movie', movieSchema);