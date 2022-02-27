const express = require("express")
const imagehandler = require("../helpers/image-handler")
let router = express.Router()
const mime = require('mime')

//serve an Image
router.get('/:file/:size?', async (req, res) => {
  var size = '' //expecting 640x480
  if (req.params.size){
    size = req.params.size
  }

  var mimetype = mime.getType(req.params.file)
  res.setHeader('Content-type', mimetype)

  //set cache so we dont have to send it a bunch of times
  res.set({
    "Cache-Control": "public, max-age=86400",
    "Expires": new Date(Date.now() + 86400000).toUTCString()
  })
  // Send the image using our imagehandler
  imagehandler.get( req.params.file, size, res)
})

module.exports = router;
