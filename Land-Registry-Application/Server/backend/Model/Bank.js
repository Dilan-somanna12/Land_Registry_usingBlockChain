var mongoose = require('mongoose')

var bankSchema = mongoose.Schema({
  bankName: { type: String, required: true },
  bankAddress: { type: String, required: true },
  contact: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  ethereumAddress: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String }, // Government username
  approvedDate: { type: Date },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('banks', bankSchema)

