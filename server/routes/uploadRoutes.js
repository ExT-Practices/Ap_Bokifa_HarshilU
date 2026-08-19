// const express = require("express");

// const router = express.Router();

// const upload = require("../middleware/uploadMiddleware");

// const {
//     uploadImage
// } = require("../controllers/uploadController");

// router.post(
//     "/",
//     upload.single("image"),
//     uploadImage
// );

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();


// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});


// ===============================
// FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );

    }

};


const upload = multer({
    storage,
    fileFilter
});


// ===============================
// UPLOAD IMAGE
// ===============================

router.post(
    "/",
    upload.single("image"),
    (req, res) => {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select an image"
            });

        }


        const imageUrl =
            `/uploads/${req.file.filename}`;


        res.json({
            success: true,
            message: "Image uploaded successfully",
            image: imageUrl
        });

    }
);


module.exports = router;