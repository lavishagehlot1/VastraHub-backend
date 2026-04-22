import multer from 'multer'

//store file temporarily 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/'); //local folder to store files temporarily.
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname); //to make filename unique by adding timestamp.
    }

})

const uploads=multer({storage:storage});

export default uploads;