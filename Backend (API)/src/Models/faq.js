const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [true, "Question is required"],
        // match : /^[a-zA-Z ]{2,15}$/,
        // match : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}+$/  This is for email pattern
        //Validate is used for custom validation
        validate: {
            validator : async function(v){
                const data = await this.constructor.findOne({name : v, deleted_at: null});
                return !data;
            },
            message: props => `The specified record is already in use`
        }
    },
    answer : {
        type : String,
        required : [true, "Answer is required"],
        default : ''
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

const faqModal = mongoose.model('faqs', faqSchema);

module.exports = faqModal;