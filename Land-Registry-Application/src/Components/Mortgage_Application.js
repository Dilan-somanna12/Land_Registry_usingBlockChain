import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiDollarSign, FiPercent, FiCalendar, FiFileText, FiUpload, FiCheckCircle, FiHome } from 'react-icons/fi'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Web3 from 'web3'
import ipfs from '../ipfs'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
`

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 50px;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 35px;
`

const Title = styled.h1`
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
`

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
`

const InputGroup = styled(motion.div)`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`

const InputWrapper = styled.div`
  position: relative;
`

const IconContainer = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 18px;
  display: flex;
  align-items: center;
  pointer-events: none;
`

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 14px 14px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
  box-sizing: border-box;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`

const FileUpload = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4f46e5;
    background: #f9fafb;
  }
  
  input[type="file"] {
    display: none;
  }
`

const UploadIcon = styled.div`
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 16px;
`

const UploadText = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`

const UploadHint = styled.div`
  color: #9ca3af;
  font-size: 12px;
`

const FileList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
`

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`

const ErrorMessage = styled(motion.div)`
  background: #fef2f2;
  border: 2px solid #ef4444;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
`

const InfoBox = styled.div`
  background: #eef2ff;
  border: 2px solid #4f46e5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #312e81;
`

class Mortgage_Application extends Component {
  constructor(props) {
    super(props)
    this.state = {
      propertyId: this.props.match?.params?.propertyId || '',
      bankAddress: '',
      loanAmount: '',
      interestRate: '',
      tenure: '',
      documents: [],
      account: '',
      web3: null,
      loading: false,
      error: '',
      banks: []
    }
  }

  componentDidMount = async () => {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadBanks()
  }

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
  }

  loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ 
      web3: web3,
      account: accounts[0]
    })
  }

  loadBanks = async () => {
    try {
      // In a real app, you'd fetch approved banks from the blockchain or API
      // For now, we'll use a placeholder
      this.setState({ banks: [] })
    } catch (error) {
      console.error('Error loading banks:', error)
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    })
  }

  handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    this.setState({
      documents: [...this.state.documents, ...files]
    })
  }

  removeFile = (index) => {
    const newFiles = this.state.documents.filter((_, i) => i !== index)
    this.setState({ documents: newFiles })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({ loading: true, error: '' })

    try {
      // Upload documents to IPFS
      let ipfsHash = ''
      if (this.state.documents.length > 0) {
        const fileData = {
          propertyId: this.state.propertyId,
          loanAmount: this.state.loanAmount,
          documents: this.state.documents.map(f => f.name)
        }
        const buf = Buffer.from(JSON.stringify(fileData))
        const result = await new Promise((resolve, reject) => {
          ipfs.files.add(buf, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        })
        ipfsHash = result[0].hash
      }

      const data = {
        propertyId: parseInt(this.state.propertyId),
        bankAddress: this.state.bankAddress,
        loanAmount: parseFloat(this.state.loanAmount),
        interestRate: parseFloat(this.state.interestRate) * 100, // Convert to basis points
        tenure: parseInt(this.state.tenure),
        ipfsHash: ipfsHash,
        propertyOwner: this.state.account
      }

      const response = await axios.post('http://localhost:3001/api/mortgage/apply', data)
      
      if (response.status === 200) {
        alert('Mortgage application submitted successfully! The bank will review your application.')
        this.props.history.push('/dashboard')
      }
    } catch (error) {
      console.error('Application error:', error)
      this.setState({
        error: error.response?.data?.message || 'Failed to submit application. Please try again.',
        loading: false
      })
    }
  }

  render() {
    return (
      <PageContainer>
        <Container>
          <FormCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header>
              <IconWrapper
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <FiDollarSign />
              </IconWrapper>
              <Title>Apply for Mortgage</Title>
              <Subtitle>Submit your mortgage application against your property</Subtitle>
            </Header>

            <InfoBox>
              <strong>Note:</strong> Your mortgage application will be reviewed by the selected bank. 
              You'll be notified once a decision is made.
            </InfoBox>

            {this.state.error && (
              <ErrorMessage
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {this.state.error}
              </ErrorMessage>
            )}

            <form onSubmit={this.handleSubmit}>
              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label>Property ID</Label>
                <InputWrapper>
                  <IconContainer><FiHome /></IconContainer>
                  <Input
                    type="number"
                    name="propertyId"
                    placeholder="Enter property ID"
                    value={this.state.propertyId}
                    onChange={this.handleChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label>Bank Ethereum Address</Label>
                <InputWrapper>
                  <IconContainer><FiDollarSign /></IconContainer>
                  <Input
                    type="text"
                    name="bankAddress"
                    placeholder="Enter bank's Ethereum address"
                    value={this.state.bankAddress}
                    onChange={this.handleChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label>Loan Amount (₹)</Label>
                <InputWrapper>
                  <IconContainer><FiDollarSign /></IconContainer>
                  <Input
                    type="number"
                    name="loanAmount"
                    placeholder="Enter loan amount"
                    value={this.state.loanAmount}
                    onChange={this.handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label>Interest Rate (%)</Label>
                <InputWrapper>
                  <IconContainer><FiPercent /></IconContainer>
                  <Input
                    type="number"
                    name="interestRate"
                    placeholder="Enter interest rate"
                    value={this.state.interestRate}
                    onChange={this.handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label>Tenure (Months)</Label>
                <InputWrapper>
                  <IconContainer><FiCalendar /></IconContainer>
                  <Input
                    type="number"
                    name="tenure"
                    placeholder="Enter loan tenure in months"
                    value={this.state.tenure}
                    onChange={this.handleChange}
                    min="1"
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label>Documents (Income Proof, Property Documents)</Label>
                <FileUpload onClick={() => document.getElementById('fileInput').click()}>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={this.handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <UploadIcon><FiUpload /></UploadIcon>
                  <UploadText>Click to upload documents</UploadText>
                  <UploadHint>PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)</UploadHint>
                </FileUpload>
                {this.state.documents.length > 0 && (
                  <FileList>
                    {this.state.documents.map((file, index) => (
                      <FileItem key={index}>
                        <span><FiFileText /> {file.name}</span>
                        <button
                          type="button"
                          onClick={() => this.removeFile(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        >
                          ×
                        </button>
                      </FileItem>
                    ))}
                  </FileList>
                )}
              </InputGroup>

              <Button
                type="submit"
                disabled={this.state.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {this.state.loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiCheckCircle /> Submit Application
                  </>
                )}
              </Button>
            </form>
          </FormCard>
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Mortgage_Application)

