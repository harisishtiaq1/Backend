const mongoose = require('mongoose');

/**
 * Contact Schema
 * @private
 */
const AnswerSchema = new mongoose.Schema({
  Userid:{createdBy:{ref:"User"}},
  Questionid:{createdBy:{ref:"User"}},
  Comment: { type: String,require:true },
}, { timestamps: true }
);

/**
 * @typedef AnswerSchema
 */


module.exports = mongoose.model('Votes', AnswerSchema);