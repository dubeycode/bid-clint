const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Bid message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Bid price is required'],
    min: [1, 'Price must be at least $1'],
    max: [1000000, 'Price cannot exceed $1,000,000']
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes
bidSchema.index({ gigId: 1, createdAt: -1 }); 
bidSchema.index({ freelancerId: 1 }); 
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true }); 

module.exports = mongoose.model('Bid', bidSchema);