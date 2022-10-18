// const express =require("express");
// const app = express();


// const multer = require('multer');
// const { path } = require("./server");
// const filestorageEngine =  multer.diskStorage({
//     destination: (req, dile, cb) => {
//         cb(null, './images' )
//     },
//     filename: (req, file, cb) =>{
//         cb(null, Date.now() + '--' + file.originalname);
//     }

// });
// const upload =multer({storage: filestorageEngine});
// app.get
// app.post('/single', upload.single ('image'),(req, res) => {
//     console.log(req.file);
//     res.send("Upload Compess");
    
// });
// app.post('/mu', upload.array('images', 2),(req, res) => {
//     console.log(req.files);
//     res.send("Woooooo!!! Compess");
// });

// app.listen(3001);
// console.log("3001 run");   