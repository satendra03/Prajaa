const multer=require('multer');

const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
      return cb(null,uploadPath);
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
  
  const upload = multer({ storage});

  module.exports=upload;