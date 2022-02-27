const express = require('express');
const speciesService = require('../services/species.service');
const router = express.Router();
const multer = require("multer")

upload = multer({dest: './uploads'})
router
  .post('/create', createSpecies)
  .get('/read/:id', readSpecies)
  .put('/update/:id', updateSpecies)
  .delete('/:id', deleteSpecies)
  .get('/', getAllSpecies)
  .post('/addlength', addSpeciesLength)
  .put('/addimage', upload.single("file"), addSpeciesImage)
  .put('/removelength', removeSpeciesLength)

  
module.exports = router;

function createSpecies(req, res, next) {
  speciesService.createSpecies(req.body)
      .then(specie => res.json(specie))
      .catch(err => next(err));
}

function getAllSpecies(req, res, next) {
  speciesService.getAllSpecies()
      .then(species => res.json(species))
      .catch(err => next(err));
}

function readSpecies(req, res, next) {
  speciesService.readSpecies(req.params.id)
      .then(specie => specie ? res.json(specie) : res.sendStatus(404))
      .catch(err => next(err));
}

function updateSpecies(req, res, next) {
  speciesService.updateSpecies(req.params.id, req.body)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function deleteSpecies(req, res, next) {
  speciesService.deleteSpecies(req.params.id)
      .then(() => res.json({}))
      .catch(err => next(err));
}

//router.put("/addimage", upload.single("file"), async (req, res) => {
function addSpeciesImage (req, res, next) {
  speciesService.addSpeciesImage(req.body.id, req.file)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function addSpeciesLength (req, res, next) {
  speciesService.addSpeciesLength(req.body.id, req.body.length, req.body.points)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function removeSpeciesLength (req, res, next) {
  console.log(req.body)
  speciesService.removeSpeciesLength(req.body.id, req.body.length, req.body.points)
      .then(() => res.json({}))
      .catch(err => next(err));
}


