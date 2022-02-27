var mongoose = require("mongoose");
var Schema = mongoose.Schema;
  
var SpeciesSchema = new Schema({
  name: { type: String, required: true },
  lengths: [
    {
      length: String,
      points: Number,
    }
  ],
  factor_rod: Number,
  factor_spear: Number,
  imagefile: String,
  imagename: String,
},
{//Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

var Species = mongoose.model("Species", SpeciesSchema);
module.exports = Species;