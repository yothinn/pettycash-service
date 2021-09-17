'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PettycashSchema = new Schema({
    id: {
        type: String 
    },
    no: {
        type: String
    },
    description: {
        type: String
    },
    deposit: {
        type: Number
    },
    withdraw: {
        type: Number
    },
    placeOfUse:{
        type:String
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