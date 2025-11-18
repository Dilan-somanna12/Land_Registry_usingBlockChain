import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiShield, FiUser, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi'
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
  max-width: 480px;
  width: 100%;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: #dc2626;
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

const Badge = styled(motion.div)`
  background: #fef2f2;
  border: 2px solid #dc2626;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const BadgeIcon = styled.div`
  color: #dc2626;
  font-size: 24px;
  display: flex;
`

const BadgeText = styled.div`
  flex: 1;
  
  h4 {
    color: #991b1b;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  
  p {
    color: #6b7280;
    font-size: 13px;
    margin: 0;
    line-height: 1.5;
  }
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
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: #dc2626;
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
    background: #b91c1c;
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
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
    color: #dc2626;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const InfoBox = styled(motion.div)`
  background: #fef2f2;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  display: flex;
  align-items: start;
  gap: 12px;
`

const InfoIcon = styled.div`
  color: #dc2626;
  font-size: 18px;
  display: flex;
  margin-top: 2px;
`

const InfoText = styled.p`
  color: #6b7280;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
`

class GovtLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      authenticated: false,
    }
  }

  componentDidMount = async () => {
    const web3 = window.web3
    const acc = await window.localStorage.getItem('web3account')
    this.setState({ account: acc })
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    if (window.localStorage.getItem('authenticated') === 'true')
      this.props.history.push('/dashboard_govt')
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSubmit = async () => {
    let data = {
      username: this.state.username,
      password: this.state.password,
    }
    if (this.state.username && this.state.password) {
      this.setState({ loading: true })
      try {
        const response = await axios.post('http://localhost:3001/login', data)
        if (response.status === 200) {
          window.alert('Login Successful')
          window.localStorage.setItem('authenticated', true)
          window.localStorage.setItem('userType', 'government')
          window.localStorage.setItem('token', response.data)
          window.location = '/dashboard_govt'
          this.setState({
            username: '',
            password: '',
            loading: false,
          })
        }
      } catch (error) {
        this.setState({ loading: false })
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || 'Login failed'
          if (errorMessage.includes('User Not Exist')) {
            alert('Government account not found. Please register the government account first.\n\nRun this command in terminal:\ncurl -X POST http://localhost:3001/register_govt\n\nThen try logging in again.')
          } else if (errorMessage.includes('Incorrect Password')) {
            alert('Incorrect password. Please check your credentials.\n\nDefault credentials:\nUsername: Karnataka Government\nPassword: Karnataka')
          } else {
            alert(`Login failed: ${errorMessage}`)
          }
        } else if (error.request) {
          // Request was made but no response received
          alert('Cannot connect to server. Please ensure the backend server is running on http://localhost:3001')
        } else {
          // Something else happened
          alert(`Login error: ${error.message}`)
        }
        this.setState({
          username: '',
          password: '',
        })
      }
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
              <FiShield />
            </IconWrapper>
            <Title>Government Portal</Title>
            <Subtitle>Authorized access only</Subtitle>
          </Header>

          <Badge
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BadgeIcon>
              <FiAlertCircle />
            </BadgeIcon>
            <BadgeText>
              <h4>Official Use Only</h4>
              <p>This portal is restricted to authorized government officials</p>
            </BadgeText>
          </Badge>

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label>Username</Label>
            <InputWrapper>
              <IconContainer><FiUser /></IconContainer>
              <Input
                type="text"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange('username')}
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label>Password</Label>
            <InputWrapper>
              <IconContainer><FiLock /></IconContainer>
              <Input
                type="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleChange('password')}
              />
            </InputWrapper>
          </InputGroup>

          <SubmitButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={this.handleSubmit}
          >
            <FiLogIn /> Sign In
          </SubmitButton>

          <InfoBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <InfoIcon>
              <FiShield />
            </InfoIcon>
            <InfoText>
              All activities are logged and monitored for security purposes.
              Default credentials: Username: Karnataka Government, Password: Karnataka
            </InfoText>
          </InfoBox>

          <Footer>
            Back to <a href="/">Home</a>
          </Footer>
        </FormCard>
      </PageContainer>
    )
  }
}

export default withRouter(GovtLogin)
