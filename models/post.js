const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criar Schema
const postSchema = new Schema ({
    subtitle:{
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('post', postSchema);