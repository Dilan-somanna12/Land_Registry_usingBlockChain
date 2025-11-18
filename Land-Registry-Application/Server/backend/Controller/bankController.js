const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Bank = require('../Model/Bank')
const Mortgage = require('../Model/Mortgage')

// Bank Registration
router.post('/register', async (req, res) => {
  const { bankName, bankAddress, contact, licenseNumber, ethereumAddress, email, password } = req.body
  try {
    let bank = await Bank.findOne({
      $or: [{ licenseNumber }, { ethereumAddress }, { email }]
    })
    if (bank) {
      return res.status(400).json({
        message: 'Bank already exists with this license number, email, or Ethereum address'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    bank = new Bank({
      bankName,
      bankAddress,
      contact,
      licenseNumber,
      ethereumAddress,
      email,
      password: hashedPassword,
      isApproved: false
    })

    await bank.save()
    res.status(200).json({
      message: 'Bank registration successful! Pending government approval.',
      bankId: bank._id
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      message: 'Error in Saving: ' + err.message
    })
  }
})

// Bank Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    let bank = await Bank.findOne({ email })
    if (!bank) {
      return res.status(400).json({
        message: 'Bank not found'
      })
    }

    if (!bank.isApproved) {
      return res.status(400).json({
        message: 'Bank registration pending government approval'
      })
    }

    const isMatch = await bcrypt.compare(password, bank.password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }

    const payload = { bank: bank, userType: 'bank' }
    const token = jwt.sign(payload, 'login successfull')
    res.status(200).json({
      token,
      bank: {
        bankName: bank.bankName,
        ethereumAddress: bank.ethereumAddress,
        licenseNumber: bank.licenseNumber
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

// Get Bank Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, 'login successfull')
    const bank = await Bank.findById(decoded.bank._id).select('-password')
    
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' })
    }

    res.status(200).json(bank)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get All Mortgages for Bank
router.get('/mortgages', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, 'login successfull')
    const bank = await Bank.findById(decoded.bank._id)
    
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' })
    }

    const mortgages = await Mortgage.find({ bankAddress: bank.ethereumAddress })
      .sort({ createdAt: -1 })
    
    res.status(200).json(mortgages)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Mortgage Details
router.get('/mortgage/:id', async (req, res) => {
  try {
    const mortgage = await Mortgage.findOne({ mortgageId: req.params.id })
    if (!mortgage) {
      return res.status(404).json({ message: 'Mortgage not found' })
    }
    res.status(200).json(mortgage)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router

