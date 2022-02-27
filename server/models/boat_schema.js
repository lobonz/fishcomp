var mongoose = require("mongoose");
var Schema = mongoose.Schema;
  
var BoatSchema = new Schema({
  name: { type: String, required: true },
  captain: String,
  imagefile: String,
  imagename: String,
},
{//Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

var Boat = mongoose.model("Boat", BoatSchema);
module.exports = Boat;