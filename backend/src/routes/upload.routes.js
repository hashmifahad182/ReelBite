const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');

const upload = multer({ storage: multer.memoryStorage() });

// Public temporary upload endpoint used for registration (uploads image to ImageKit)
router.post('/temp', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file provided' });

        const result = await storageService.uploadFile(req.file.buffer, uuid());
        return res.status(201).json({ message: 'Uploaded', url: result.url });
    } catch (err) {
        console.error('upload error', err);
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

module.exports = router;
