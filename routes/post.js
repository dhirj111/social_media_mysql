
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser'); 
const adminController = require('../controllers/post');

const router = express.Router();

// Route to serve the main page
router.get('/', adminController.serveindex);


// Middleware to create a new post
router.post('/postdetails', adminController.newpost);


// Middleware to get all posts with their comments
router.post('/postdetails',adminController.getpostcomments );

// Middleware to get all posts with their comments
router.get('/posts', adminController.getpostcomments);


// Middleware to add a comment to a specific post
router.post('/comments', adminController.addcommentonpost);


module.exports = router;
