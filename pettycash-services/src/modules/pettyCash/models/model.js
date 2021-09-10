'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PettycashSchema = new Schema({
    name: {
        type: String,
        // required: 'Please fill a Attendances name',
    },
    lastName: {
        type: String,
        // required: 'Please fill a Attendances lastName',
    },
    financialAmount: {
        type: Number,
        // required: 'Please fill a Attendances limit',
    },
    position: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});
PettycashSchema.pre('save', function(next){
    let Pettycash = this;
    const model = mongoose.model("Pettycash", PettycashSchema);
    if (Pettycash.isNew) {
        // create
        next();
    }else{
        // update
        Pettycash.updated = new Date();
        next();
    }
    
    
})
mongoose.model("Pettycash", PettycashSchema);