const express = require('express');
const boatService = require('../services/boat.service');
const router = express.Router();
const multer = require("multer")

upload = multer({dest: './uploads'})
router
  .post('/create', createBoat)
  .get('/read/:id', readBoat)
  .put('/update/:id', updateBoat)
  .delete('/:id', deleteBoat)
  .get('/', getAllBoats)
  .put('/addimage', upload.single("file"), addBoatimage)
  
module.exports = router;

function createBoat(req, res, next) {
  boatService.createBoat(req.body)
      .then(boat => res.json(boat))
      .catch(err => next(err));
}

function getAllBoats(req, res, next) {
  boatService.getAllBoats()
      .then(boats => res.json(boats))
      .catch(err => next(err));
}

function readBoat(req, res, next) {
  boatService.readBoat(req.params.id)
      .then(boat => boat ? res.json(boat) : res.sendStatus(404))
      .catch(err => next(err));
}

function updateBoat(req, res, next) {
  boatService.updateBoat(req.params.id, req.body)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function deleteBoat(req, res, next) {
  boatService.deleteBoat(req.params.id)
      .then(() => res.json({}))
      .catch(err => next(err));
}

//router.put("/addimage", upload.single("file"), async (req, res) => {
function addBoatimage (req, res, next) {
  console.log(req.body.id)
  boatService.addBoatimage(req.body.id, req.file)
      .then(() => res.json({}))
      .catch(err => next(err));
}


