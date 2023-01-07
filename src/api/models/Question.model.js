const mongoose = require('mongoose');

/**
 * Contact Schema
 * @private
 */
const QuestionSchema = new mongoose.Schema({
  createdBy:{ref:"User"},
  Title: { type: String,require:true },
  Description:{type:String,require:true},
}, { timestamps: true }
);

/**
 * @typedef QuestionSchema
 */


module.exports = mongoose.model('Question', QuestionSchema);