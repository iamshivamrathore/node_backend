var mongoose = require( 'mongoose' ), Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var User = require('./users.js');

var TaskSchema = new mongoose.Schema({
    title : { type :String,required:true },
    description : { type :String,required:true },
    participants : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    time : { type :Date,default: Date.now },
    venue : { type :String,required:true },
    ownerId : { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Task', TaskSchema);