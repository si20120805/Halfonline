const mongoose = require('mongoose');

const productschema = mongoose.Schema({


    name: {
        type: String,
        required: [true, 'please enter name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'please ennter discription']
    },
    price: {
        type: Number,
        required: [true, 'please enter price'],
        maxLength: [6, 'price cannot greater']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: [true, 'please enter product']
    },

    stock: {
        type: Number,
        required: [true, 'please enter stock'],
        maxLength: [4, 'stock cannot exceed '],
        default: 1
    },
    noofRewiews: {
        type: Number,
        default: 0
    },
    reviews: [
        {

            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true},
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }

        }
    ],
    createdAT: {
        type: Date,
        default: Date.now
    }




})

module.exports = mongoose.model("Product", productschema)