import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiLogIn, FiShield, FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi'
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
  background: ${props => props.connected ? '#f0fdf4' : '#fef2f2'};
  border: 2px solid ${props => props.connected ? '#10b981' : '#ef4444'};
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
  flex: 1;
`

const BadgeIcon = styled.div`
  color: ${props => props.connected ? '#10b981' : '#ef4444'};
  font-size: 24px;
  display: flex;
`

const BadgeText = styled.div`
  flex: 1;
  h4 {
    color: ${props => props.connected ? '#065f46' : '#991b1b'};
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
  background: ${props => props.connected ? '#10b981' : '#ef4444'};
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

const InfoBox = styled(motion.div)`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  display: flex;
  align-items: start;
  gap: 12px;
  
  p {
    color: #6b7280;
    font-size: 13px;
    margin: 0;
    line-height: 1.6;
  }
`

const InfoIcon = styled.div`
  color: #6b7280;
  font-size: 18px;
  display: flex;
  margin-top: 2px;
`

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      authenticated: false,
    }
  }

  componentDidMount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    await window.localStorage.setItem('web3account', accounts[0])
    this.setState({ account: accounts[0], address: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log('Detected Network ID:', networkId)
    console.log('Available networks in contract:', Object.keys(Land.networks))
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network. Detected network ID: ' + networkId)
    }

    if (window.localStorage.getItem('authenticated') === 'true')
      window.location = '/dashboard'
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSubmit = async () => {
    let data = {
      address: this.state.address,
    }
    if (this.state.address) {
      try {
        const user = await this.state.landList.methods
          .getUser(data.address)
          .call()

        if (user) {
          this.setState({
            uid: user[0],
            uname: user[1],
            ucontact: user[2],
            uemail: user[3],
            ucode: user[4],
            ucity: user[5],
            exist: user[6],
          })
          if (this.state.exist) {
            window.localStorage.setItem('authenticated', true)
            window.localStorage.setItem('userType', 'user')
            window.location = '/dashboard'
          } else {
            console.log('Login Failed')
            alert('Account not found. Please register first.')
            window.localStorage.setItem('authenticated', false)
            this.props.history.push('/signup')
          }
        } else {
          console.log('Please try again')
        }
      } catch (error) {
        console.log('error:', error)
        alert('Login failed. Please make sure you are registered.')
      }
    } else {
      alert('Please connect your MetaMask wallet')
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
              <FiLogIn />
            </IconWrapper>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to your account</Subtitle>
          </Header>

          {this.state.account ? (
            <MetaMaskBadge
              connected
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BadgeContent>
                <BadgeIcon connected>
                  <FiCheckCircle />
                </BadgeIcon>
                <BadgeText connected>
                  <h4>MetaMask Connected</h4>
                  <p>{this.state.account.slice(0, 6)}...{this.state.account.slice(-4)}</p>
                </BadgeText>
              </BadgeContent>
              <StatusBadge connected>Active</StatusBadge>
            </MetaMaskBadge>
          ) : (
            <MetaMaskBadge
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BadgeContent>
                <BadgeIcon>
                  <FiAlertCircle />
                </BadgeIcon>
                <BadgeText>
                  <h4>MetaMask Not Connected</h4>
                  <p>Please connect your wallet</p>
                </BadgeText>
              </BadgeContent>
              <StatusBadge>Inactive</StatusBadge>
            </MetaMaskBadge>
          )}

          <InputGroup
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label>Your Ethereum Address</Label>
            <InputWrapper>
              <IconContainer><FiShield /></IconContainer>
              <Input
                type="text"
                placeholder="Connected from MetaMask"
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
            <FiLogIn /> Sign In
          </SubmitButton>

          <InfoBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <InfoIcon>
              <FiLock />
            </InfoIcon>
            <p>
              Your account is secured with blockchain technology.
              Make sure you're connected to the correct network.
            </p>
          </InfoBox>

          <Footer>
            Don't have an account? <a href="/signup">Sign up here</a>
          </Footer>
        </FormCard>
      </PageContainer>
    )
  }
}

export default withRouter(Login)
