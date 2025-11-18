import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiShield, FiCheckCircle, FiUserPlus } from 'react-icons/fi'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Land from '../abis/LandRegistry.json'

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
  max-width: 600px;
  width: 100%;
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
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const SubmitButton = styled(motion.button)`
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
  gap: 8px;
  margin-top: 32px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4338ca;
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #9ca3af;
  }
`

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
  
  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      address: '',
      residentialAddress: '',
      postalCode: '',
      city: '',
      contact: '',
    }
  }

  componentDidMount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    await window.localStorage.setItem('web3account', accounts[0])
    this.setState({ account: accounts[0], address: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }
    if (window.localStorage.getItem('authenticated') === 'true')
      this.props.history.push('/dashboard')
  }

  validateEmail = (emailField) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (reg.test(emailField) === false) {
      return false
    }
    return true
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  login = async (data) => {
    await this.state.landList.methods
      .addUser(
        data.address,
        data.name,
        data.contact,
        data.email,
        data.postalCode,
        data.city,
      )
      .send({ from: this.state.account, gas: 1000000 })
      .on('receipt', function (receipt) {
        if (!receipt) {
          console.log('Could not add User. Please try again')
        } else {
          console.log('User has been added successfully!')
          window.alert('Registration successful! Redirecting to login...')
          window.location = '/login'
        }
      })
  }

  handleSubmit = async () => {
    let mongoData = {
      name: this.state.name,
      email: this.state.email,
      contact: this.state.contact,
      address: this.state.residentialAddress,
      city: this.state.city,
      postalCode: this.state.postalCode,
    }
    
    let blockchainData = {
      address: this.state.address,
      name: this.state.name,
      email: this.state.email,
      contact: this.state.contact,
      city: this.state.city,
      postalCode: this.state.postalCode,
    }
    
    if (
      this.state.name &&
      this.state.email &&
      this.state.contact &&
      this.state.residentialAddress &&
      this.state.city &&
      this.state.postalCode
    ) {
      if (this.validateEmail(this.state.email)) {
        axios.post('http://localhost:3001/signup', mongoData).then(
          (response) => {
            if (response.status === 200) {
              this.setState({
                name: '',
                email: '',
                residentialAddress: '',
                postalCode: '',
                city: '',
                contact: '',
              })
            }

            try {
              this.login(blockchainData)
            } catch (error) {
              console.log('error:', error)
            }
          },
          (error) => {
            this.setState({ loading: false })
            alert('User already exists. Try with another email address')
            this.setState({
              name: '',
              email: '',
              residentialAddress: '',
              postalCode: '',
              city: '',
              contact: '',
            })
          },
        )
      } else alert('Please enter a correct email address')
    } else {
      alert('All fields are required')
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
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FiUserPlus />
            </IconWrapper>
            <Title>Create Your Account</Title>
            <Subtitle>Join the blockchain-powered land registry</Subtitle>
          </Header>

          {this.state.account && (
            <MetaMaskBadge
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BadgeContent>
                <BadgeIcon>
                  <FiCheckCircle />
                </BadgeIcon>
                <BadgeText>
                  <h4>MetaMask Connected</h4>
                  <p>{this.state.account.slice(0, 6)}...{this.state.account.slice(-4)}</p>
                </BadgeText>
              </BadgeContent>
              <StatusBadge>Active</StatusBadge>
            </MetaMaskBadge>
          )}

          <GridContainer>
            <InputGroup
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label>Full Name</Label>
              <InputWrapper>
                <IconContainer><FiUser /></IconContainer>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Label>Email Address</Label>
              <InputWrapper>
                <IconContainer><FiMail /></IconContainer>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                />
              </InputWrapper>
            </InputGroup>
          </GridContainer>

          <GridContainer>
            <InputGroup
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label>Contact Number</Label>
              <InputWrapper>
                <IconContainer><FiPhone /></IconContainer>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  value={this.state.contact}
                  onChange={this.handleChange('contact')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Label>City</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Your city"
                  value={this.state.city}
                  onChange={this.handleChange('city')}
                />
              </InputWrapper>
            </InputGroup>
          </GridContainer>

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label>Residential Address</Label>
            <InputWrapper>
              <IconContainer><FiHome /></IconContainer>
              <Input
                type="text"
                placeholder="123 Main Street"
                value={this.state.residentialAddress}
                onChange={this.handleChange('residentialAddress')}
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Label>Postal Code</Label>
            <InputWrapper>
              <IconContainer><FiMapPin /></IconContainer>
              <Input
                type="text"
                placeholder="110001"
                value={this.state.postalCode}
                onChange={this.handleChange('postalCode')}
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Label>Ethereum Address</Label>
            <InputWrapper>
              <IconContainer><FiShield /></IconContainer>
              <Input
                type="text"
                value={this.state.address}
                disabled
              />
            </InputWrapper>
          </InputGroup>

          <SubmitButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={this.handleSubmit}
            disabled={!this.state.account}
          >
            <FiCheckCircle /> Create Account
          </SubmitButton>

          <Footer>
            Already have an account? <a href="/login">Login here</a>
          </Footer>
        </FormCard>
      </PageContainer>
    )
  }
}

export default withRouter(Register)
