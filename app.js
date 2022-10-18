const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
/////
const storage = multer.diskStorage({
     destination: './upload/images',
     filename: (req, file, cb)=>{
          return cb(null, `${file.filename}_${Date.now()}${path.extname(req.file.originalname)}`);
     }
})


const upload = multer({
     storage:storage
})
app.use('/profile', express.static('upload/imges'));
app.post("/upload", upload.single('profile'), (req, res) => {
     
     res.json({
          success:1,
          profile_url: `http://localhost:4000/profile/$(req.file.filename)`
     })
 
})


app.listen(4000, () => {
     console.log("server ON")

})