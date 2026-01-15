const mongoose = require('mongoose');
const Bid = require('../models/bid');
const Gig = require('../models/gig');

// @desc    Submit a bid
// @route   POST /api/bids
// @access  Private
const submitBid = async (req, res, next) => {
  try {
    const { gigId, message, price } = req.body;

    // Validate input
    if (!gigId || !message || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gigId, message, and price'
      });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }

    // Prevent gig owner from bidding on their own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid: populatedBid
    });
  } catch (error) {
    // Handle duplicate bid error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }
    next(error);
  }
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Gig owner only)
const getBidsForGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Verify user is gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Hire a freelancer for a gig
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
const hireBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    //  Find bid and its gig
    const bid = await Bid.findById(bidId).populate('gigId');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    const gig = bid.gigId;

    //  Verify user is gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized - You are not the gig owner'
      });
    }

    //  Check if gig is  open (prevent double hiring)
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned'
      });
    }

    //  Perform  updates
    await Gig.findOneAndUpdate(
      { _id: gig._id, status: 'open' }, // ensure  open
      {
        status: 'assigned',
        hiredBidId: bidId
      }
    );

    await Bid.findOneAndUpdate(
      { _id: bidId, status: 'pending' },
      { status: 'hired' }
    );

    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    // Get updated bid with populated fields for response + socket
    const updatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title')
      .lean();

    // Emit socket event 
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${updatedBid.freelancerId._id}`).emit('hired', {
        message: `You have been hired for "${updatedBid.gigId.title}"!`,
        gigTitle: updatedBid.gigId.title,
        gigId: updatedBid.gigId._id,
        bidId: updatedBid._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: updatedBid
    });

  } catch (error) {
    console.error('Hire transaction error:', error);
    next(error);
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/my-bids
// @access  Private
const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title budget status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitBid,
  getBidsForGig,
  hireBid,
  getMyBids
};