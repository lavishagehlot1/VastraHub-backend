import multer from 'multer';
import fs from 'fs';


//if upload folder doesn't exist, create it
if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads'); //create uploads folder if it doesn't exist
}

//store file temporarily 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/'); //local folder to store files temporarily.
    },
     filename: (req, file, cb) => {
    const name = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + name);
     },

});

// const fileFilter=(req,file,cb)=>{
//       switch (file.mimetype) {
//     case "image/jpeg":
//     case "image/jpg":
//     case "image/png":
    
//       cb(null, true);
//       break;

//     default:
//       cb(new Error("Only JPG, PNG, JPEG  are allowed"), false);
//   }
// }
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;