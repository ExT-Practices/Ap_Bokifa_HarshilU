// UPLOAD IMAGE

const uploadImage = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please select an image."
        });
    }

    res.status(200).json({
        success: true,
        message: "Image Uploaded Successfully",
        filename: req.file.filename,
        imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
    });

};

module.exports = {
    uploadImage
};