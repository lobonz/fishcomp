const express = require('express');

const boatService = require('../services/boat.service');

const router = express.Router();

router
  .post('/create', createBoat)
  .get('/read/:id', readBoat)
  .put('/update/:id', updateBoat)
  .post('/delete', deleteBoat)
  .get('/', getAllBoats)

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
  boatService.delete(req.params.id)
      .then(() => res.json({}))
      .catch(err => next(err));
}
