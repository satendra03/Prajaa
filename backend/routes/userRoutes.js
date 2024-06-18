const express = require('express');

const router = express.Router();

const USER = require('../model/userSchema');
const { jwtAuthMiddleware } = require('../middleware/jwtAuthMiddleware');

const { convertTowebP } = require('../utils/sendMail');

const cloudinary = require('../utils/cloudinary');

const upload=require('../middleware/multer');

// get profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const user = await USER.findById(req.user.id);
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.json({ error: 'internal server error' });
    }

})

//changing the profile
router.post('/profileImage', jwtAuthMiddleware, upload.single('profileImage'), async (req, res) => {

    try {
        const originalFilePath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
        const newFilePath = path.join(__dirname, '..', 'public', 'uploads', `${req.file.filename}.webp`);

        //converting image to webP
        await convertTowebP(originalFilePath, newFilePath);

        // delete the orginal file
        fs.unlinkSync(originalFilePath);

        //uploadig the webP image to cloudinary
        const result = await cloudinary.uploader.upload(newFilePath);

        console.log(result);

        // again deleting the webP image from server
        fs.unlinkSync(newFilePath);

        res.json({ message: result.secure_url });

    }
    catch (err) {
        console.log(err);
        res.json({ error: 'internal server error' });
    }
})





module.exports = router;