const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Surveyor = require('../Model/Surveyor')
const Survey = require('../Model/Survey')

// Surveyor Registration
router.post('/register', async (req, res) => {
  const { name, licenseNumber, contact, email, specialization, experienceYears, ethereumAddress, password } = req.body
  try {
    let surveyor = await Surveyor.findOne({
      $or: [{ licenseNumber }, { ethereumAddress }, { email }]
    })
    if (surveyor) {
      return res.status(400).json({
        message: 'Surveyor already exists with this license number, email, or Ethereum address'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    surveyor = new Surveyor({
      name,
      licenseNumber,
      contact,
      email,
      specialization,
      experienceYears,
      ethereumAddress,
      password: hashedPassword,
      isApproved: false
    })

    await surveyor.save()
    res.status(200).json({
      message: 'Surveyor registration successful! Pending government approval.',
      surveyorId: surveyor._id
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      message: 'Error in Saving: ' + err.message
    })
  }
})

// Surveyor Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    let surveyor = await Surveyor.findOne({ email })
    if (!surveyor) {
      return res.status(400).json({
        message: 'Surveyor not found'
      })
    }

    if (!surveyor.isApproved) {
      return res.status(400).json({
        message: 'Surveyor registration pending government approval'
      })
    }

    const isMatch = await bcrypt.compare(password, surveyor.password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }

    const payload = { surveyor: surveyor, userType: 'surveyor' }
    const token = jwt.sign(payload, 'login successfull')
    res.status(200).json({
      token,
      surveyor: {
        name: surveyor.name,
        ethereumAddress: surveyor.ethereumAddress,
        licenseNumber: surveyor.licenseNumber
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

// Get Surveyor Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, 'login successfull')
    const surveyor = await Surveyor.findById(decoded.surveyor._id).select('-password')
    
    if (!surveyor) {
      return res.status(404).json({ message: 'Surveyor not found' })
    }

    res.status(200).json(surveyor)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get All Surveys for Surveyor
router.get('/surveys', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, 'login successfull')
    const surveyor = await Surveyor.findById(decoded.surveyor._id)
    
    if (!surveyor) {
      return res.status(404).json({ message: 'Surveyor not found' })
    }

    const surveys = await Survey.find({ surveyorAddress: surveyor.ethereumAddress })
      .sort({ createdAt: -1 })
    
    res.status(200).json(surveys)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Survey Details
router.get('/survey/:id', async (req, res) => {
  try {
    const survey = await Survey.findOne({ surveyId: req.params.id })
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' })
    }
    res.status(200).json(survey)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router

