'use strict';
const jwt = require('jsonwebtoken');
const Boat = require('../models/boat_schema');

async function getAllBoats() {
  return await Boat.find().select('-hash')
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
  const boat = await Boat.findById(id).select('-hash');
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

async function deleteBoat(id) {
  await Boat.findByIdAndRemove(id);
}

async function authenticateBoat({ email, password }) {
  email = String(email).toLowerCase()
  //console.log (email)
  const boat = await Boat.findOne({ email: new RegExp(`^${email}$`, 'i') })
  //console.log (boat.email)
  if (boat && bcrypt.compareSync(password, boat.hash)) {

      const { hash, ...boatWithoutHash } = boat.toObject();
      //console.log(process.env.SECRET)
      const token = jwt.sign({ sub: boat.id }, process.env.SECRET);
      return {
          ...boatWithoutHash,
          token
      };
  }
}

module.exports = {
  getAllBoats,
  createBoat,
  readBoat,
  updateBoat,
  deleteBoat,
};
