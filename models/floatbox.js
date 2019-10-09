var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var floatboxschema = new Schema({
  activeStatus: {type: Boolean, default:true},
  name: {
    type: String, maxlength:100   
  },
  password: {
    type: String, maxlength:100   
  },
  float: String,
});
module.exports = mongoose.model('floatbox', floatboxschema);
