import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiBriefcase, FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

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

const Badge = styled(motion.div)`
  background: #eef2ff;
  border: 2px solid #4f46e5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const BadgeIcon = styled.div`
  color: #4f46e5;
  font-size: 24px;
  display: flex;
`

const BadgeText = styled.div`
  flex: 1;
  
  h4 {
    color: #312e81;
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

class Bank_Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false
    }
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

    try {
      const data = {
        email: this.state.email,
        password: this.state.password
      }

      const response = await axios.post('http://localhost:3001/api/bank/login', data)
      
      if (response.status === 200) {
        window.localStorage.setItem('token', response.data.token)
        window.localStorage.setItem('userType', 'bank')
        window.localStorage.setItem('authenticated', 'true')
        window.localStorage.setItem('bankData', JSON.stringify(response.data.bank))
        this.props.history.push('/bank_dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed'
        if (errorMessage.includes('not found')) {
          this.setState({
            error: 'Bank account not found. Please register first.',
            loading: false
          })
        } else if (errorMessage.includes('approval')) {
          this.setState({
            error: 'Your bank registration is pending government approval. Please wait for approval.',
            loading: false
          })
        } else if (errorMessage.includes('Password')) {
          this.setState({
            error: 'Incorrect password. Please check your credentials.',
            loading: false
          })
        } else {
          this.setState({
            error: `Login failed: ${errorMessage}`,
            loading: false
          })
        }
      } else {
        this.setState({
          error: 'Network error. Please check your connection and try again.',
          loading: false
        })
      }
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
              <FiBriefcase />
            </IconWrapper>
            <Title>Bank Login</Title>
            <Subtitle>Access your bank dashboard</Subtitle>
          </Header>

          <Badge
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <BadgeIcon><FiBriefcase /></BadgeIcon>
            <BadgeText>
              <h4>Bank Portal</h4>
              <p>Login to manage mortgages and review applications</p>
            </BadgeText>
          </Badge>

          {this.state.error && (
            <ErrorMessage
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FiAlertCircle /> {this.state.error}
            </ErrorMessage>
          )}

          <form onSubmit={this.handleSubmit}>
            <InputGroup
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label>Email Address</Label>
              <InputWrapper>
                <IconContainer><FiMail /></IconContainer>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={this.state.email}
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
              <Label>Password</Label>
              <InputWrapper>
                <IconContainer><FiLock /></IconContainer>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <SubmitButton
              type="submit"
              disabled={this.state.loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {this.state.loading ? (
                <>Processing...</>
              ) : (
                <>
                  <FiLogIn /> Login
                </>
              )}
            </SubmitButton>
          </form>

          <Footer>
            Don't have an account? <a href="/bank_register">Register here</a>
          </Footer>
        </FormCard>
      </PageContainer>
    )
  }
}

export default withRouter(Bank_Login)

