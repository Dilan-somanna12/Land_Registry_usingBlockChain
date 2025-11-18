const express = require('express')
const router = express.Router()
const Mortgage = require('../Model/Mortgage')
const Bank = require('../Model/Bank')

// Apply for Mortgage (User)
router.post('/apply', async (req, res) => {
  const { propertyId, bankAddress, loanAmount, interestRate, tenure, ipfsHash, propertyOwner } = req.body
  try {
    // Generate mortgage ID (simple increment, in production use better method)
    const count = await Mortgage.countDocuments()
    const mortgageId = count + 1

    const mortgage = new Mortgage({
      mortgageId,
      propertyId,
      propertyOwner,
      bankAddress,
      loanAmount,
      interestRate,
      tenure,
      remainingBalance: loanAmount,
      ipfsHash,
      status: 'Pending',
      lienActive: false
    })

    await mortgage.save()
    res.status(200).json({
      message: 'Mortgage application submitted successfully',
      mortgageId
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      message: 'Error in Saving: ' + err.message
    })
  }
})

// Get User's Mortgages
router.get('/my-mortgages', async (req, res) => {
  try {
    const { propertyOwner } = req.query
    if (!propertyOwner) {
      return res.status(400).json({ message: 'Property owner address required' })
    }

    const mortgages = await Mortgage.find({ propertyOwner })
      .sort({ createdAt: -1 })
    
    res.status(200).json(mortgages)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Mortgage for Property
router.get('/property/:id', async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({ 
      propertyId: req.params.id,
      status: { $in: ['Active', 'Pending', 'Approved'] }
    })
    
    if (!mortgage) {
      return res.status(404).json({ message: 'No active mortgage found for this property' })
    }
    
    res.status(200).json(mortgage)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Record Payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, transactionHash } = req.body
    const mortgage = await Mortgage.findOne({ mortgageId: req.params.id })
    
    if (!mortgage) {
      return res.status(404).json({ message: 'Mortgage not found' })
    }

    mortgage.payments.push({
      amount,
      transactionHash,
      date: new Date()
    })

    mortgage.remainingBalance = Math.max(0, mortgage.remainingBalance - amount)
    
    if (mortgage.remainingBalance === 0) {
      mortgage.status = 'PaidOff'
      mortgage.lienActive = false
    }

    mortgage.updatedAt = new Date()
    await mortgage.save()

    res.status(200).json({
      message: 'Payment recorded successfully',
      remainingBalance: mortgage.remainingBalance
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Payment History
router.get('/:id/history', async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({ mortgageId: req.params.id })
    
    if (!mortgage) {
      return res.status(404).json({ message: 'Mortgage not found' })
    }

    res.status(200).json({
      payments: mortgage.payments,
      totalPaid: mortgage.loanAmount - mortgage.remainingBalance,
      remainingBalance: mortgage.remainingBalance
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router

