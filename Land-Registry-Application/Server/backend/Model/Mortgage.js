var mongoose = require('mongoose')

var paymentSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  transactionHash: { type: String }
})

var mortgageSchema = mongoose.Schema({
  mortgageId: { type: Number, required: true, unique: true },
  propertyId: { type: Number, required: true },
  propertyOwner: { type: String, required: true }, // Ethereum address
  bankAddress: { type: String, required: true }, // Ethereum address
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true }, // in basis points
  tenure: { type: Number, required: true }, // in months
  remainingBalance: { type: Number, required: true },
  startDate: { type: Date },
  nextPaymentDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Active', 'PaidOff', 'Defaulted', 'Foreclosed'],
    default: 'Pending'
  },
  ipfsHash: { type: String },
  lienActive: { type: Boolean, default: false },
  payments: [paymentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('mortgages', mortgageSchema)

