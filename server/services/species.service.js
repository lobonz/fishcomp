'use strict';
const jwt = require('jsonwebtoken');
const Species = require('../models/species_schema');
const path = require("path")
const sharp = require('sharp')
const fs = require("fs")
var mime = require('mime')
const imagehandler = require("../helpers/image-handler")

async function getAllSpecies() {
  return await Species.find()
}

async function createSpecies (specieParam) {
  console.log(specieParam)
  // validate
  if (await Species.findOne({ speciename: specieParam.name })) {
      throw 'Speciesname "' + specieParam.name + '" is already taken';
  }
  //add default permissions
  //specieParam.permissions = { dev: false, admin: false, customer: false, customeradmin: false }

  const specie = new Species(specieParam);

  // save specie
  await specie.save();
  return { specieid: specie._id }
}

async function readSpecies(id) {
  const specie = await Species.findById(id);
  return specie
}

async function updateSpecies(id, specieParam) {
  const specie = await Species.findById(id);

  // validate
  if (!specie) throw 'Species not found';
  if (specie.name !== specieParam.name && await Species.findOne({ speciename: specieParam.name })) {
      throw 'Species Name "' + specieParam.name + '" is already taken';
  }

  // hash password if it was entered
  // if (specieParam.password) {
  //     specieParam.hash = bcrypt.hashSync(specieParam.password, 10);
  // }

  // copy specieParam properties to specie
  console.log("===specieParam===")
  console.log(specieParam)
  Object.assign(specie, specieParam);
  await specie.save();
}

async function deleteSpecies (id) {
  Species.findById(id, async (error, species) => {
    if (error) {
      console.error(error);
    }
    //remove uploaded original
    var speciesimagefile = null
    if (species.imagefile) {
      speciesimagefile = path.join(__dirname, "../uploads", species.imagefile)
    }
    console.log("========================")
    console.log(speciesimagefile)
    if (fs.existsSync(speciesimagefile)) {
      fs.unlinkSync(speciesimagefile)
    }
    await Species.findByIdAndRemove(id);
  })
}

async function addSpeciesLength (id, length, points) {
  Species.findById(id, async (error, species) => {
    if (error) {
      console.error(error);
    }
    console.log(species)
    if (species.lengths == null) {
      species.lengths = [{ length: length, points: points }]
    } else {
      species.lengths.push({
        length: length,
        points: points,
      })
    }
    //console.log(part.sustainability.materials[part.sustainability.materials.length-1])
    species.save(function(error) {
      if (error) {
        console.log(error);
        return false
      } else {
        return true
      }
    });

  })
}


async function removeSpeciesLength (id, length, points) {
  console.log("=======ID=========")
  console.log(id)
  Species.findById(id, async (error, species) => {
    if (error) {
      console.error(error);
    }
    console.log(species)

    var speciesLengths = species.lengths
    //remove the delted length
    speciesLengths.forEach(function(lengthitem) {
      if (lengthitem.length == length) {
        speciesLengths.splice(speciesLengths.indexOf(lengthitem), 1);
      }
    });

    species.lengths = speciesLengths;

    //console.log(part.sustainability.materials[part.sustainability.materials.length-1])
    species.save(function(error) {
      if (error) {
        console.log(error);
        return false
      } else {
        return true
      }
    });

  })
}

// Add a Species Image
//router.put("/addimage", upload.single("file"), async (req, res) => {
async function addSpeciesImage(id, file) {
    Species.findById(id, "imagefile", async (error, species) => {
      if (error) {
        console.error(error);
      }

      if (species.imagefile) {
        //remove existing
        fs.unlinkSync(path.join(__dirname, "../uploads", species.imagefile))
        species.imagename = ""
      }
      console.log(file)//originalname
      var imagefile = file.filename + path.extname(file.originalname)

      const uploadedfile = path.join(__dirname, "../uploads", file.filename)
      console.log(uploadedfile)
      const destinationfile = path.join(__dirname, "../uploads", imagefile)

      // Run some optimisations on the uploaded image
      await sharp(uploadedfile)
      .resize(1920, null, { fit: 'inside', withoutEnlargement: true }).toFile(destinationfile)
      
      //remove uploaded original
      fs.unlinkSync(uploadedfile)
        
      species.imagefile = imagefile
      species.imagename = file.originalname
      
      species.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          return { success: true }
        }
      });
    });
}

module.exports = {
  getAllSpecies,
  createSpecies,
  readSpecies,
  updateSpecies,
  deleteSpecies,
  addSpeciesImage,
  addSpeciesLength,
  removeSpeciesLength,
};
