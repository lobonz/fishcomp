var mongoose = require("mongoose");
var Schema = mongoose.Schema;
  
var FishSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  boat: { type: Schema.Types.ObjectId, ref: 'boat' },
  species: { type: Schema.Types.ObjectId, ref: 'species' },
  method: String, //Rod, Spear
  length: String,
  points: Number,
  imagefile: String,
},
{//Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

var Fish = mongoose.model("Fish", FishSchema);
module.exports = Fish;