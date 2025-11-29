const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Name is required"],
        match : /^[a-zA-Z ]{2,15}$/,
        // match : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}+$/  This is for email pattern
        //Validate is used for custom validation
        // validate: {
        //     validator : async function(v){
        //         const data = await this.constructor.findOne({name : v, deleted_at: null});
        //         return !data;
        //     },
        //     message: props => `The specified record is already in use`
        // }
    },
    slug : {
        type : String,
        default : '',
    },
    image : {
        type : String,
        default : '',
    },
    sub_category : {
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

const categoryModal = mongoose.model('categories', categorySchema);

module.exports = categoryModal;