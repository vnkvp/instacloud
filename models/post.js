const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criar Schema
const postSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        type: String
    },
    details:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('post', postSchema);