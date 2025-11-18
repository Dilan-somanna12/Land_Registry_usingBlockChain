const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var User = require('../Model/User')
var Govt = require('../Model/Government_Registrar')
var Bank = require('../Model/Bank')
var Surveyor = require('../Model/Surveyor')
var sms = require('../Api/send_sms')
var mail = require('../Api/send_mail')
router.post('/signup', async (req, res) => {
  const { email, name, contact, address, city, postalCode } = req.body
  try {
    let user = await User.findOne({
      email,
    })
    if (user) {
      return res.status(400).json({
        message: 'User Already Exists',
      })
    }

    user = new User({
      email,
      name,
      contact,
      address,
      city,
      postalCode,
    })

    await user.save()
    res.status(200).send('Thanks for registering!')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Error in Saving')
  }
})

router.post('/register_govt', async (req, res) => {
  // Insert details straight into MongoDB
    try {
      const username="Karnataka Government";
      const password="Karnataka";
      const address="Vidhana Soudha, Dr. B.R. Ambedkar Road, Bengaluru";
      const contact="08022255550"
      const city="Bengaluru"
      
      // Check if government account already exists
      let existingUser = await Govt.findOne({ username })
      if (existingUser) {
        return res.status(200).send('Government account already exists! You can login with:\nUsername: Karnataka Government\nPassword: Karnataka')
      }
      
      let user = new Govt({
        username,
        password,
        address,
        contact,
        city,
      })
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      res.status(200).send('Government account registered successfully!\n\nLogin credentials:\nUsername: Karnataka Government\nPassword: Karnataka')
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Error in Saving: ' + err.message)
    }       
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    let user = await Govt.findOne({
      username,
    })
    if (!user)
      return res.status(400).json({
        message: 'User Not Exist',
      })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({
        message: 'Incorrect Password !',
      })
    var payload = { user: user }
    // console.log(payload);
    var token = jwt.sign(payload, 'login successfull')
    res.status(200).send(token)
    // res.send('Login Successfully')
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: 'Server Error',
    })
  }
})

router.post('/send_mail', async (req, res) => {
  const { lemail, message, subject, number } = req.body
  mail.send_mail(lemail, message, subject)
  sms.send_sms(number, message)
  res.status(200).send('Mail Sent!')
})

// Get Pending Banks
router.get('/pending_banks', async (req, res) => {
  try {
    const banks = await Bank.find({ isApproved: false }).sort({ createdAt: -1 })
    res.status(200).json(banks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Pending Surveyors
router.get('/pending_surveyors', async (req, res) => {
  try {
    const surveyors = await Surveyor.find({ isApproved: false }).sort({ createdAt: -1 })
    res.status(200).json(surveyors)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Approve Bank
router.put('/approve_bank/:id', async (req, res) => {
  try {
    const { approvedBy } = req.body
    const bank = await Bank.findById(req.params.id)
    
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' })
    }
    
    bank.isApproved = true
    bank.approvedBy = approvedBy
    bank.approvedDate = new Date()
    await bank.save()
    
    res.status(200).json({ message: 'Bank approved successfully', bank })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Reject Bank
router.put('/reject_bank/:id', async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id)
    
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' })
    }
    
    await Bank.findByIdAndDelete(req.params.id)
    
    res.status(200).json({ message: 'Bank rejected and removed' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Approve Surveyor
router.put('/approve_surveyor/:id', async (req, res) => {
  try {
    const { approvedBy } = req.body
    const surveyor = await Surveyor.findById(req.params.id)
    
    if (!surveyor) {
      return res.status(404).json({ message: 'Surveyor not found' })
    }
    
    surveyor.isApproved = true
    surveyor.approvedBy = approvedBy
    surveyor.approvedDate = new Date()
    await surveyor.save()
    
    res.status(200).json({ message: 'Surveyor approved successfully', surveyor })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Reject Surveyor
router.put('/reject_surveyor/:id', async (req, res) => {
  try {
    const surveyor = await Surveyor.findById(req.params.id)
    
    if (!surveyor) {
      return res.status(404).json({ message: 'Surveyor not found' })
    }
    
    await Surveyor.findByIdAndDelete(req.params.id)
    
    res.status(200).json({ message: 'Surveyor rejected and removed' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router
