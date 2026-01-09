const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Name is required"],
    },
    slug : {
        type : String,
        default : '',
    },
    image : {
        type : String,
        default : '',
    },
    parent_category : {
        type : Object,
        ref : 'categories',
        default : '',
    },
    sub_sub_categories : {
        type : Array,
        default : [],
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

const subCategoryModal = mongoose.model('sub_categories', subCategorySchema);

module.exports = subCategoryModal;