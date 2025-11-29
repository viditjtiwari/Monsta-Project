const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Name is required"],
        match : /^[a-zA-Z ]{2,15}$/,
    },
    image : {
        type : String,
        default : '',
    },
    designation : {
        type : String,
        default : '',
    },
    rating : {
        type : Number,
        default : ''
    },
    message : {
        type : String,
        default : '',
    },
    status : {
        type: Boolean, //0 - inactive, 1 - active
        default: 1
    },
    order : {
        type: Number,
        default: 0,
        min : [0, "Order can not be negative"],
        max : [1000, "Order can not be more than 1000"]
    },
    created_at : {
        type: Date,
        default: Date.now()
    },
    updated_at : {
        type: Date,
        default: Date.now()
    },
    deleted_at : {
        type: Date,
        default: null
    }
});

const testimonialModal = mongoose.model('testimonials', testimonialSchema);

module.exports = testimonialModal;