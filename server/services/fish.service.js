'use strict';
const Fish = require('../models/fish_schema')
const path = require("path")
const sharp = require('sharp')
const fs = require("fs")
var mime = require('mime')
const imagehandler = require("../helpers/image-handler")

async function getAllFish() {
  return await Fish.find()
    .populate({ path: 'user',
                model: 'User'
    })
    .populate({ path: 'boat',
                model: 'Boat'
    })
    .populate({ path: 'species',
                model: 'Species'
    })
}

async function createFish (fishParam) {
  console.log(fishParam)

  //add default permissions
  //fishParam.permissions = { dev: false, admin: false, customer: false, customeradmin: false }

  const fish = new Fish(fishParam);

  // save fish
  await fish.save();
  return { fishid: fish._id }
}

async function readFish(id) {
  const fish = await Fish.findById(id);
  return fish
}

async function updateFish(id, fishParam) {
  const fish = await Fish.findById(id);

  // validate
  if (!fish) throw 'Fish not found';

  // copy fishParam properties to fish
  Object.assign(fish, fishParam);
  await fish.save();
}

async function deleteFish (id) {
  Fish.findById(id, async (error, fish) => {
    if (error) {
      console.error(error);
    }
    //remove uploaded original if we have one
    if (fish.imagefile) {
      const fishimagefile = path.join(__dirname, "../uploads", fish.imagefile)
      fs.unlinkSync(fishimagefile)
    }
    await Fish.findByIdAndRemove(id);
  })
}

// Add a Fish Image
//router.put("/addimage", upload.single("file"), async (req, res) => {
async function addFishimage(id, file) {
    Fish.findById(id, "imagefile", async (error, fish) => {
      if (error) {
        console.error(error);
      }

      if (fish.imagefile) {
        //remove existing
        fs.unlinkSync(path.join(__dirname, "../uploads", fish.imagefile))
        fish.imagename = ""
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
        
      fish.imagefile = imagefile
      fish.imagename = file.originalname
      
      fish.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          return { success: true }
        }
      });
    });
  }

module.exports = {
  getAllFish,
  createFish,
  readFish,
  updateFish,
  deleteFish,
  addFishimage,
};
