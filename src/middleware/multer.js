const multer = require("multer");

// 🌟 THE FIX: Switch from diskStorage to memoryStorage so req.file.buffer becomes available
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;