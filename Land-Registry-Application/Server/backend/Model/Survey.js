var mongoose = require('mongoose')

var surveySchema = mongoose.Schema({
  surveyId: { type: Number, required: true, unique: true },
  propertyId: { type: Number, required: true },
  propertyOwner: { type: String, required: true }, // Ethereum address
  surveyorAddress: { type: String }, // Ethereum address
  requestedBy: { type: String, required: true }, // Owner or Government
  surveyType: { 
    type: String, 
    enum: ['Boundary', 'Topographic', 'Construction', 'Subdivision', 'Other'],
    required: true 
  },
  ipfsHash: { type: String },
  gpsCoordinates: { type: String },
  surveyDate: { type: Date },
  submissionDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'InProgress', 'Submitted', 'Approved', 'RevisionRequested', 'Rejected'],
    default: 'Pending'
  },
  remarks: { type: String },
  assignedBy: { type: String }, // Government username
  verifiedBy: { type: String }, // Government username
  verifiedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('surveys', surveySchema)

