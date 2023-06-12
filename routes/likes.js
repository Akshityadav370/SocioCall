const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes_controller');

console.log('likes router loaded')
router.get('/toggle', likesController.toggleLike);

module.exports = router;