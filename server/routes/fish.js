const express = require('express');
const fishService = require('../services/fish.service');
const router = express.Router();
const multer = require("multer")

upload = multer({dest: './uploads'})
router
  .post('/create', createFish)
  .get('/read/:id', readFish)
  .put('/update/:id', updateFish)
  .delete('/:id', deleteFish)
  .get('/', getAllFish)
  .put('/addimage', upload.single("file"), addFishimage)
  
module.exports = router;

function createFish(req, res, next) {
  fishService.createFish(req.body)
      .then(fish => res.json(fish))
      .catch(err => next(err));
}

function getAllFish(req, res, next) {
  fishService.getAllFish()
      .then(fish => res.json(fish))
      .catch(err => next(err));
}

function readFish(req, res, next) {
  fishService.readFish(req.params.id)
      .then(fish => fish ? res.json(fish) : res.sendStatus(404))
      .catch(err => next(err));
}

function updateFish(req, res, next) {
  fishService.updateFish(req.params.id, req.body)
      .then(() => res.json({}))
      .catch(err => next(err));
}

function deleteFish(req, res, next) {
  fishService.deleteFish(req.params.id)
      .then(() => res.json({}))
      .catch(err => next(err));
}

//router.put("/addimage", upload.single("file"), async (req, res) => {
function addFishimage (req, res, next) {
  console.log(req.body.id)
  fishService.addFishimage(req.body.id, req.file)
      .then(() => res.json({}))
      .catch(err => next(err));
}


