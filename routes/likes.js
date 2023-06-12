const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes_controller');

console.log('likes router loaded')
router.post('/toggle', likesController.toggleLike);

module.exports = router;