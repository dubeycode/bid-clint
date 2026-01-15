const Gig = require('../models/gig');

// @desc    Get all open gigs with search
// @route   GET /api/gigs?search=keyword
// @access  Public
const getGigs = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    let query = { status: 'open' };
    
    // Text search if search param provided
    if (search) {
      query.$text = { $search: search };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email')
      .lean();

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res, next) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig: populatedGig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGigs,
  getGig,
  createGig,
  getMyGigs
};