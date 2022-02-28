'use strict';
const Boat = require('../models/boat_schema');
const path = require("path")
const sharp = require('sharp')
const fs = require("fs")
var mime = require('mime')
const imagehandler = require("../helpers/image-handler")

async function getAllBoats() {
  return await Boat.find()
}

async function createBoat (boatParam) {
  console.log(boatParam)
  // validate
  if (await Boat.findOne({ boatname: boatParam.name })) {
      throw 'Boatname "' + boatParam.name + '" is already taken';
  }
  //add default permissions
  //boatParam.permissions = { dev: false, admin: false, customer: false, customeradmin: false }

  const boat = new Boat(boatParam);

  // save boat
  await boat.save();
  return { boatid: boat._id }
}

async function readBoat(id) {
  const boat = await Boat.findById(id);
  return boat
}

async function updateBoat(id, boatParam) {
  const boat = await Boat.findById(id);

  // validate
  if (!boat) throw 'Boat not found';
  if (boat.name !== boatParam.name && await Boat.findOne({ boatname: boatParam.name })) {
      throw 'Boatname "' + boatParam.name + '" is already taken';
  }

  // hash password if it was entered
  // if (boatParam.password) {
  //     boatParam.hash = bcrypt.hashSync(boatParam.password, 10);
  // }

  // copy boatParam properties to boat
  Object.assign(boat, boatParam);
  await boat.save();
}

async function deleteBoat (id) {
  Boat.findById(id, async (error, boat) => {
    if (error) {
      console.error(error);
    }
    //remove uploaded original
    const boatimagefile = path.join(__dirname, "../uploads", boat.imagefile)
    fs.unlinkSync(boatimagefile)
    await Boat.findByIdAndRemove(id);
  })
}

// Add a Boat Image
//router.put("/addimage", upload.single("file"), async (req, res) => {
async function addBoatimage(id, file) {
    Boat.findById(id, "imagefile", async (error, boat) => {
      if (error) {
        console.error(error);
      }

      if (boat.imagefile) {
        //remove existing
        fs.unlinkSync(path.join(__dirname, "../uploads", boat.imagefile))
        boat.imagename = ""
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
        
      boat.imagefile = imagefile
      boat.imagename = file.originalname
      
      boat.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          return { success: true }
        }
      });
    });
  }

module.exports = {
  getAllBoats,
  createBoat,
  readBoat,
  updateBoat,
  deleteBoat,
  addBoatimage,
};
