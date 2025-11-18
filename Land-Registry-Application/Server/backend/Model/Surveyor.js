var mongoose = require('mongoose')

var surveyorSchema = mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  ethereumAddress: { type: String, required: true, unique: true },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String }, // Government username
  approvedDate: { type: Date },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('surveyors', surveyorSchema)

