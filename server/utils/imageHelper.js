const baseUrl = process.env.BASE_URL || "http://localhost:5000";

const getImageUrl = (filename) => {
    return filename ? `${baseUrl}/uploads/${filename}` : null;
};

module.exports = getImageUrl;

