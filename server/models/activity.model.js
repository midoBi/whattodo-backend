const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
    title: String,
    duration: String,
    image: String,
    reviews: String,
    target: String,
    hasPromotion: String,
    price: String,
    tag: {
        title: String,
        color: String
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
