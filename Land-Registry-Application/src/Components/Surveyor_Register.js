import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiShield, FiLock, FiCheckCircle, FiAward } from 'react-icons/fi'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Web3 from 'web3'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 50px;
  max-width: 700px;
  width: 100%;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: #10b981;
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

const MetaMaskBadge = styled(motion.div)`
  background: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const BadgeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const BadgeIcon = styled.div`
  color: #10b981;
  font-size: 24px;
  display: flex;
`

const BadgeText = styled.div`
  h4 {
    color: #065f46;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  p {
    color: #6b7280;
    font-size: 12px;
    margin: 0;
    font-family: monospace;
    word-break: break-all;
  }
`

const StatusBadge = styled.span`
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
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
  border: 2px solid ${props => props.disabled ? '#e5e7eb' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: ${props => props.disabled ? '#f9fafb' : 'white'};
  color: ${props => props.disabled ? '#9ca3af' : '#1f2937'};
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: #10b981;
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
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`

const InfoText = styled.p`
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  margin-top: 24px;
  
  a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
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
  display: flex;
  align-items: center;
  gap: 10px;
`

class Surveyor_Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      licenseNumber: '',
      contact: '',
      email: '',
      specialization: '',
      experienceYears: '',
      password: '',
      confirmPassword: '',
      ethereumAddress: '',
      account: '',
      web3: null,
      error: '',
      loading: false
    }
  }

  componentDidMount = async () => {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ 
      web3: web3,
      account: accounts[0],
      ethereumAddress: accounts[0]
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({ loading: true, error: '' })

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ 
        error: 'Passwords do not match',
        loading: false 
      })
      return
    }

    if (this.state.password.length < 6) {
      this.setState({ 
        error: 'Password must be at least 6 characters',
        loading: false 
      })
      return
    }

    try {
      const data = {
        name: this.state.name,
        licenseNumber: this.state.licenseNumber,
        contact: this.state.contact,
        email: this.state.email,
        specialization: this.state.specialization,
        experienceYears: parseInt(this.state.experienceYears),
        password: this.state.password,
        ethereumAddress: this.state.ethereumAddress
      }

      const response = await axios.post('http://localhost:3001/api/surveyor/register', data)
      
      if (response.status === 200) {
        alert('Surveyor registration successful! Your account is pending government approval. You will be notified once approved.')
        this.props.history.push('/surveyor_login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      this.setState({
        error: error.response?.data?.message || 'Registration failed. Please try again.',
        loading: false
      })
    }
  }

  render() {
    return (
      <PageContainer>
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
              <FiAward />
            </IconWrapper>
            <Title>Surveyor Registration</Title>
            <Subtitle>Register as a certified surveyor</Subtitle>
          </Header>

          {this.state.account && (
            <MetaMaskBadge
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <BadgeContent>
                <BadgeIcon><FiShield /></BadgeIcon>
                <BadgeText>
                  <h4>MetaMask Connected</h4>
                  <p>{this.state.account}</p>
                </BadgeText>
              </BadgeContent>
              <StatusBadge>Connected</StatusBadge>
            </MetaMaskBadge>
          )}

          {this.state.error && (
            <ErrorMessage
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FiShield /> {this.state.error}
            </ErrorMessage>
          )}

          <form onSubmit={this.handleSubmit}>
            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label>Full Name</Label>
              <InputWrapper>
                <IconContainer><FiUser /></IconContainer>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={this.state.name}
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
              <Label>License/Certification Number</Label>
              <InputWrapper>
                <IconContainer><FiAward /></IconContainer>
                <Input
                  type="text"
                  name="licenseNumber"
                  placeholder="Enter license number"
                  value={this.state.licenseNumber}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label>Contact Number</Label>
              <InputWrapper>
                <IconContainer><FiPhone /></IconContainer>
                <Input
                  type="tel"
                  name="contact"
                  placeholder="Enter contact number"
                  value={this.state.contact}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Label>Email Address</Label>
              <InputWrapper>
                <IconContainer><FiMail /></IconContainer>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Label>Specialization</Label>
              <InputWrapper>
                <IconContainer><FiAward /></IconContainer>
                <Select
                  name="specialization"
                  value={this.state.specialization}
                  onChange={this.handleChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Boundary Survey">Boundary Survey</option>
                  <option value="Topographic Survey">Topographic Survey</option>
                  <option value="Construction Survey">Construction Survey</option>
                  <option value="Subdivision Survey">Subdivision Survey</option>
                  <option value="Other">Other</option>
                </Select>
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Label>Years of Experience</Label>
              <InputWrapper>
                <IconContainer><FiAward /></IconContainer>
                <Input
                  type="number"
                  name="experienceYears"
                  placeholder="Enter years of experience"
                  value={this.state.experienceYears}
                  onChange={this.handleChange}
                  min="0"
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Label>Ethereum Address</Label>
              <InputWrapper>
                <IconContainer><FiShield /></IconContainer>
                <Input
                  type="text"
                  value={this.state.account || 'Connect MetaMask'}
                  disabled
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Label>Password</Label>
              <InputWrapper>
                <IconContainer><FiLock /></IconContainer>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Label>Confirm Password</Label>
              <InputWrapper>
                <IconContainer><FiLock /></IconContainer>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <Button
              type="submit"
              disabled={this.state.loading || !this.state.account}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {this.state.loading ? (
                <>Processing...</>
              ) : (
                <>
                  <FiCheckCircle /> Register Surveyor
                </>
              )}
            </Button>
          </form>

          <InfoText>
            Already registered? <a href="/surveyor_login">Login here</a>
          </InfoText>
        </FormCard>
      </PageContainer>
    )
  }
}

export default withRouter(Surveyor_Register)

