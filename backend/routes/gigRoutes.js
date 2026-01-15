const express = require('express');
const { getGigs, getGig, createGig, getMyGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getGigs); 
router.get('/my-gigs', protect, getMyGigs); 
router.get('/:id', getGig); 
router.post('/', protect, createGig); 

module.exports = router;