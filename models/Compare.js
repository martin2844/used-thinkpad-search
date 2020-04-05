const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompareSchema = new Schema({
   query: {
       type: String,
       required: true,
   },
   type: {
    type: String,
    required: true
   },
   data: {
       type: Array,
       required: true
   }
});

const Compare = mongoose.model('compare', CompareSchema);
module.exports = Compare;