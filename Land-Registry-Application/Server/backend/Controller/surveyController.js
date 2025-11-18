const express = require('express')
const router = express.Router()
const Survey = require('../Model/Survey')
const Surveyor = require('../Model/Surveyor')

// Request Survey
router.post('/request', async (req, res) => {
  const { propertyId, propertyOwner, requestedBy, surveyType } = req.body
  try {
    // Generate survey ID
    const count = await Survey.countDocuments()
    const surveyId = count + 1

    const survey = new Survey({
      surveyId,
      propertyId,
      propertyOwner,
      requestedBy,
      surveyType,
      status: 'Pending'
    })

    await survey.save()
    res.status(200).json({
      message: 'Survey request submitted successfully',
      surveyId
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      message: 'Error in Saving: ' + err.message
    })
  }
})

// Get All Surveys
router.get('/list', async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 })
    res.status(200).json(surveys)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Surveys for Property
router.get('/property/:id', async (req, res) => {
  try {
    const surveys = await Survey.find({ propertyId: req.params.id })
      .sort({ createdAt: -1 })
    res.status(200).json(surveys)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Assign Survey to Surveyor (Government)
router.post('/:id/assign', async (req, res) => {
  try {
    const { surveyorAddress, assignedBy } = req.body
    const survey = await Survey.findOne({ surveyId: req.params.id })
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' })
    }

    const surveyor = await Surveyor.findOne({ ethereumAddress: surveyorAddress })
    if (!surveyor || !surveyor.isApproved) {
      return res.status(400).json({ message: 'Invalid or unapproved surveyor' })
    }

    survey.surveyorAddress = surveyorAddress
    survey.assignedBy = assignedBy
    survey.status = 'Assigned'
    survey.updatedAt = new Date()
    
    await survey.save()

    res.status(200).json({
      message: 'Survey assigned successfully',
      survey
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Submit Survey Report (Surveyor)
router.post('/:id/submit', async (req, res) => {
  try {
    const { ipfsHash, gpsCoordinates, surveyDate } = req.body
    const survey = await Survey.findOne({ surveyId: req.params.id })
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' })
    }

    if (survey.status !== 'Assigned' && survey.status !== 'InProgress') {
      return res.status(400).json({ message: 'Survey is not assigned or in progress' })
    }

    survey.ipfsHash = ipfsHash
    survey.gpsCoordinates = gpsCoordinates
    survey.surveyDate = surveyDate || new Date()
    survey.submissionDate = new Date()
    survey.status = 'Submitted'
    survey.updatedAt = new Date()
    
    await survey.save()

    res.status(200).json({
      message: 'Survey report submitted successfully',
      survey
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Verify Survey (Government)
router.put('/:id/verify', async (req, res) => {
  try {
    const { approved, remarks, verifiedBy } = req.body
    const survey = await Survey.findOne({ surveyId: req.params.id })
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' })
    }

    if (survey.status !== 'Submitted') {
      return res.status(400).json({ message: 'Survey is not submitted for verification' })
    }

    survey.verifiedBy = verifiedBy
    survey.remarks = remarks || ''
    survey.verifiedDate = new Date()
    
    if (approved) {
      survey.status = 'Approved'
    } else {
      survey.status = 'Rejected'
    }
    
    survey.updatedAt = new Date()
    await survey.save()

    res.status(200).json({
      message: approved ? 'Survey approved successfully' : 'Survey rejected',
      survey
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server Error' })
  }
})

// Get Survey Details
router.get('/:id', async (req, res) => {
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

