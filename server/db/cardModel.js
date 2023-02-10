const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: true,
    },

    name: {
        type: String,
        required: [true, "Please provide a card name"],
    },
    
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },

    price: {
        type: Number,
        required: [true, "Please provide sell price"],
    },

    image: {
        type: String,
        required: [true, "Please provide an image for your card"],
    },
});

module.exports = mongoose.model.Cards || mongoose.model("Cards", CardSchema);