import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiKey, FiDollarSign, FiCopy, FiCheckCircle } from 'react-icons/fi'
import { withRouter } from 'react-router-dom'
import Land from '../abis/LandRegistry.json'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
`

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const PageHeader = styled(motion.div)`
  margin-bottom: 30px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
`

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: 350px 1fr;
  }
`

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 40px;
  text-align: center;
`

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 48px;
  color: white;
  font-weight: 700;
`

const UserName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`

const UserLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 24px;
`

const WalletCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
`

const WalletLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`

const WalletBalance = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const DetailsCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 40px;
`

const DetailsTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
`

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const DetailItem = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f3f4f6;
  }
`

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.color || '#4f46e5'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
`

const DetailContent = styled.div`
  flex: 1;
`

const DetailLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

const DetailValue = styled.div`
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
  word-break: break-all;
`

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 18px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4338ca;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
`

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      authenticated: false,
      copied: false,
      isLoading: true,
    }
  }

  componentDidMount = async () => {
    // Check if government user - redirect to dashboard
    const userType = window.localStorage.getItem('userType')
    if (userType === 'government') {
      this.props.history.push('/dashboard_govt')
      return
    }

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    await window.localStorage.setItem('web3account', accounts[0])
    this.setState({ account: accounts[0] })
    
    const balance = await web3.eth.getBalance(accounts[0])
    this.setState({ balance: (balance / 1000000000000000000).toFixed(4) })
    
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    if (
      !window.localStorage.getItem('authenticated') ||
      window.localStorage.getItem('authenticated') === 'false'
    )
      this.props.history.push('/login')

    const user = await this.state.landList.methods.getUser(accounts[0]).call()
    this.setState({
      uid: user[0],
      uname: user[1],
      ucontact: user[2],
      uemail: user[3],
      ucode: user[4],
      ucity: user[5],
      exist: user[6],
      isLoading: false,
    })
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    this.setState({ copied: true })
    setTimeout(() => {
      this.setState({ copied: false })
    }, 2000)
  }

  getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <div>Loading profile...</div>
        </LoadingContainer>
      )
    }

    return (
      <PageContainer>
        <Container>
          <PageHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title>My Profile</Title>
            <Subtitle>View and manage your account information</Subtitle>
          </PageHeader>

          <ProfileGrid>
            <ProfileCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Avatar>
                {this.getInitials(this.state.uname)}
              </Avatar>
              <UserName>{this.state.uname || 'User'}</UserName>
              <UserLocation>
                <FiMapPin />
                {this.state.ucity || 'City'}
              </UserLocation>

              <WalletCard>
                <WalletLabel>Wallet Balance</WalletLabel>
                <WalletBalance>
                  <FiDollarSign />
                  {this.state.balance || '0.0000'} ETH
                </WalletBalance>
              </WalletCard>
            </ProfileCard>

            <DetailsCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DetailsTitle>Account Details</DetailsTitle>
              <DetailsList>
                <DetailItem>
                  <DetailIcon color="#3b82f6">
                    <FiUser />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Full Name</DetailLabel>
                    <DetailValue>{this.state.uname || 'Not available'}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon color="#8b5cf6">
                    <FiMail />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Email Address</DetailLabel>
                    <DetailValue>{this.state.uemail || 'Not available'}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon color="#10b981">
                    <FiPhone />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Contact Number</DetailLabel>
                    <DetailValue>+91-{this.state.ucontact || 'Not available'}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon color="#f59e0b">
                    <FiMapPin />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Postal Code</DetailLabel>
                    <DetailValue>{this.state.ucode || 'Not available'}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon color="#ef4444">
                    <FiKey />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Ethereum Address</DetailLabel>
                    <DetailValue>{this.state.account || 'Not connected'}</DetailValue>
                  </DetailContent>
                  <CopyButton
                    onClick={() => this.copyToClipboard(this.state.account)}
                    title="Copy address"
                  >
                    {this.state.copied ? <FiCheckCircle /> : <FiCopy />}
                  </CopyButton>
                </DetailItem>
              </DetailsList>
            </DetailsCard>
          </ProfileGrid>
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Profile)
