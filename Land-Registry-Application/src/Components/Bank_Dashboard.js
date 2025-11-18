import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiBriefcase, FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiLoader, FiTrendingUp } from 'react-icons/fi'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Web3 from 'web3'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 30px 20px;
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled(motion.div)`
  margin-bottom: 30px;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

const TitleSection = styled.div``

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const BankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #eef2ff;
  border: 2px solid #4f46e5;
  color: #312e81;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
`

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid ${props => props.borderColor || '#e5e7eb'};
`

const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.color || '#1f2937'};
  display: flex;
  align-items: center;
  gap: 8px;
`

const TabsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 2px solid #f3f4f6;
  padding: 8px;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Tab = styled(motion.button)`
  flex: 1;
  padding: 14px 24px;
  background: ${props => props.active ? '#4f46e5' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#4338ca' : '#f3f4f6'};
    color: ${props => props.active ? 'white' : '#1f2937'};
  }
  
  svg {
    font-size: 18px;
  }
`

const TabContent = styled(motion.div)`
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`

const MortgageCard = styled(motion.div)`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
  }
`

const MortgageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`

const MortgageInfo = styled.div`
  flex: 1;
`

const MortgageId = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`

const PropertyId = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'Active') return '#dbeafe'
    if (props.status === 'Pending') return '#fef3c7'
    if (props.status === 'Approved') return '#d1fae5'
    if (props.status === 'PaidOff') return '#d1fae5'
    return '#fee2e2'
  }};
  color: ${props => {
    if (props.status === 'Active') return '#1e40af'
    if (props.status === 'Pending') return '#92400e'
    if (props.status === 'Approved') return '#065f46'
    if (props.status === 'PaidOff') return '#065f46'
    return '#991b1b'
  }};
`

const MortgageDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DetailLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
`

const DetailValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Button = styled(motion.button)`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #4f46e5;
        color: white;
        &:hover { background: #4338ca; }
      `
    }
    if (props.variant === 'success') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `
    }
    if (props.variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `
    }
    return `
      background: #f3f4f6;
      color: #374151;
      &:hover { background: #e5e7eb; }
    `
  }}
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`

const LoadingSpinner = styled(motion.div)`
  font-size: 48px;
  color: #4f46e5;
`

const LoadingText = styled.p`
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`

class Bank_Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
      mortgages: [],
      loading: true,
      stats: {
        total: 0,
        pending: 0,
        active: 0,
        paidOff: 0
      },
      account: '',
      web3: null
    }
  }

  componentWillMount = async () => {
    const userType = window.localStorage.getItem('userType')
    if (userType !== 'bank') {
      this.props.history.push('/bank_login')
      return
    }
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadMortgages()
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

  loadMortgages = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const response = await axios.get('http://localhost:3001/api/bank/mortgages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const mortgages = response.data || []
      const stats = {
        total: mortgages.length,
        pending: mortgages.filter(m => m.status === 'Pending').length,
        active: mortgages.filter(m => m.status === 'Active').length,
        paidOff: mortgages.filter(m => m.status === 'PaidOff').length
      }
      
      this.setState({ mortgages, stats, loading: false })
    } catch (error) {
      console.error('Error loading mortgages:', error)
      this.setState({ loading: false })
    }
  }

  handleTabChange = (tabIndex) => {
    this.setState({ activeTab: tabIndex })
  }

  handleApproveMortgage = async (mortgageId) => {
    if (!window.confirm('Are you sure you want to approve this mortgage application?')) {
      return
    }

    try {
      // Here you would call the smart contract to approve the mortgage
      // For now, we'll just update the status in MongoDB
      const token = window.localStorage.getItem('token')
      await axios.put(`http://localhost:3001/api/bank/mortgage/${mortgageId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Mortgage approved successfully!')
      await this.loadMortgages()
    } catch (error) {
      console.error('Error approving mortgage:', error)
      alert('Failed to approve mortgage. Please try again.')
    }
  }

  handleRejectMortgage = async (mortgageId) => {
    if (!window.confirm('Are you sure you want to reject this mortgage application?')) {
      return
    }

    try {
      const token = window.localStorage.getItem('token')
      await axios.put(`http://localhost:3001/api/bank/mortgage/${mortgageId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Mortgage rejected.')
      await this.loadMortgages()
    } catch (error) {
      console.error('Error rejecting mortgage:', error)
      alert('Failed to reject mortgage. Please try again.')
    }
  }

  renderMortgages = (filterStatus = null) => {
    const filtered = filterStatus 
      ? this.state.mortgages.filter(m => m.status === filterStatus)
      : this.state.mortgages

    if (filtered.length === 0) {
      return (
        <EmptyState>
          <FiLoader size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No mortgages found</p>
        </EmptyState>
      )
    }

    return filtered.map((mortgage, index) => (
      <MortgageCard
        key={mortgage.mortgageId || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <MortgageHeader>
          <MortgageInfo>
            <MortgageId>Mortgage #{mortgage.mortgageId}</MortgageId>
            <PropertyId>Property ID: {mortgage.propertyId}</PropertyId>
          </MortgageInfo>
          <StatusBadge status={mortgage.status}>
            {mortgage.status === 'Pending' && <FiClock />}
            {mortgage.status === 'Active' && <FiTrendingUp />}
            {mortgage.status === 'PaidOff' && <FiCheckCircle />}
            {mortgage.status}
          </StatusBadge>
        </MortgageHeader>
        
        <MortgageDetails>
          <DetailItem>
            <DetailLabel>Loan Amount</DetailLabel>
            <DetailValue>₹{mortgage.loanAmount?.toLocaleString() || '0'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Interest Rate</DetailLabel>
            <DetailValue>{(mortgage.interestRate / 100).toFixed(2)}%</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Tenure</DetailLabel>
            <DetailValue>{mortgage.tenure} months</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Remaining Balance</DetailLabel>
            <DetailValue>₹{mortgage.remainingBalance?.toLocaleString() || '0'}</DetailValue>
          </DetailItem>
        </MortgageDetails>

        {mortgage.status === 'Pending' && (
          <ActionButtons>
            <Button
              variant="success"
              onClick={() => this.handleApproveMortgage(mortgage.mortgageId)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiCheckCircle /> Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => this.handleRejectMortgage(mortgage.mortgageId)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiXCircle /> Reject
            </Button>
          </ActionButtons>
        )}
      </MortgageCard>
    ))
  }

  render() {
    if (this.state.loading) {
      return (
        <PageContainer>
          <Container>
            <LoadingContainer>
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader />
              </LoadingSpinner>
              <LoadingText>Loading dashboard...</LoadingText>
            </LoadingContainer>
          </Container>
        </PageContainer>
      )
    }

    return (
      <PageContainer>
        <Container>
          <PageHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HeaderTop>
              <TitleSection>
                <Title>
                  <FiBriefcase /> Bank Dashboard
                  <BankBadge><FiBriefcase /> Bank Portal</BankBadge>
                </Title>
                <Subtitle>Manage mortgages and review applications</Subtitle>
              </TitleSection>
            </HeaderTop>
          </PageHeader>

          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              borderColor="#4f46e5"
            >
              <StatLabel>Total Mortgages</StatLabel>
              <StatValue color="#4f46e5">
                <FiDollarSign /> {this.state.stats.total}
              </StatValue>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              borderColor="#f59e0b"
            >
              <StatLabel>Pending</StatLabel>
              <StatValue color="#f59e0b">
                <FiClock /> {this.state.stats.pending}
              </StatValue>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              borderColor="#10b981"
            >
              <StatLabel>Active</StatLabel>
              <StatValue color="#10b981">
                <FiTrendingUp /> {this.state.stats.active}
              </StatValue>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              borderColor="#059669"
            >
              <StatLabel>Paid Off</StatLabel>
              <StatValue color="#059669">
                <FiCheckCircle /> {this.state.stats.paidOff}
              </StatValue>
            </StatCard>
          </StatsGrid>

          <TabsContainer>
            <TabsHeader>
              <Tab
                active={this.state.activeTab === 0}
                onClick={() => this.handleTabChange(0)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiClock /> Pending Applications
              </Tab>
              <Tab
                active={this.state.activeTab === 1}
                onClick={() => this.handleTabChange(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTrendingUp /> Active Mortgages
              </Tab>
              <Tab
                active={this.state.activeTab === 2}
                onClick={() => this.handleTabChange(2)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCheckCircle /> All Mortgages
              </Tab>
            </TabsHeader>
            <TabContent>
              {this.state.activeTab === 0 && this.renderMortgages('Pending')}
              {this.state.activeTab === 1 && this.renderMortgages('Active')}
              {this.state.activeTab === 2 && this.renderMortgages()}
            </TabContent>
          </TabsContainer>
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Bank_Dashboard)

