const sharp = require('sharp')
const fs = require("fs") // Or `import fs from "fs";` with ESM
const path = require("path")
const mime = require('mime')

module.exports.get = get
module.exports.deletecached = deletecached

async function get(file, imagesize, res) {

  var size = '' //expecting 640x480
  if (imagesize){
    size = imagesize
  }

  var mimetype = mime.getType(file)
  res.setHeader('Content-type', mimetype)

  //set cache so we dont have to send it a bunch of times
  res.set({
    "Cache-Control": "public, max-age=86400",
    "Expires": new Date(Date.now() + 86400000).toUTCString()
  })
  // Send the image using our imagehandler
  
    //check if image exists for this size
    var x = null
    var y = null

    if (size != ''){
      if (size.includes("x")){
        //get x & y size
        [x,y] = size.split('x')
        //make sure these are numbers'
        x = parseInt(x)
        y = parseInt(y)
        if (!isNaN(x)) {x = null}
        if (!isNaN(y)) {y = null}
      }else{
        x = parseInt(size)
      }

      size = x+'x'+y+'_'
    }

    //construct the original file path
    var originalfile = path.join(
      __dirname,
      '../uploads/',
      file
    )
    //construct the requested file path
    var requestedfile = path.join(
      __dirname,
      '../uploads/',
      size+file
    )

    var outputfile = ''
    if (!fs.existsSync(requestedfile) && fs.existsSync(originalfile)) {
      const readStream = fs.createReadStream(originalfile)
      let transform = sharp()

      if (x || y) {
        transform = transform.resize(x, y, {fit: 'inside'})
      }
      readStream.pipe(transform).pipe(res)
    }else if (fs.existsSync(originalfile)){
      //use existing
          fs.createReadStream(requestedfile).pipe(res)
    }else{//missing image
      var errorimagepath = path.join(__dirname, '../images/image-placeholder-error.jpg')
      fs.createReadStream(errorimagepath).pipe(res)
    }
}

function deletecached() {

}
