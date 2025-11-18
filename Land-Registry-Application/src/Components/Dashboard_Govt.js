import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiShield, FiLoader, FiCheckCircle, FiAlertCircle, FiBriefcase, FiAward, FiXCircle } from 'react-icons/fi'
import { withRouter } from 'react-router-dom'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'
import Table from '../Containers/Govt_Table'
import Web3 from 'web3'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

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

const GovBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #fef2f2;
  border: 2px solid #dc2626;
  color: #991b1b;
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
  margin-bottom: 30px;
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
  background: ${props => props.active ? '#dc2626' : 'transparent'};
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
    background: ${props => props.active ? '#b91c1c' : '#f3f4f6'};
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

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
`

const ApprovalCard = styled(motion.div)`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #dc2626;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`

const CardSubtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
`

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  font-size: 14px;
  font-weight: 600;
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

const TableHeader = styled.div`
  margin-bottom: 24px;
`

const TableTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`

const TableSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
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
  color: #dc2626;
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

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
  color: #dc2626;
`

const EmptyText = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #6b7280;
`

const EmptySubtext = styled.p`
  font-size: 14px;
  margin: 0;
  color: #9ca3af;
`

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetList: [],
      isLoading: true,
      username: '',
      Governmentpublickey: '',
      address: '',
      contact: '',
      city: '',
      imgurl: '',
      activeTab: 0,
      pendingBanks: [],
      pendingSurveyors: [],
      loadingBanks: false,
      loadingSurveyors: false
    }
  }

  componentWillMount = async () => {
    // Check if regular user - redirect to user dashboard
    const userType = window.localStorage.getItem('userType')
    if (userType !== 'government') {
      this.props.history.push('/dashboard')
      return
    }

    const user = jwtDecode(window.localStorage.getItem('token'))
    this.setState({ ...user.user })
    
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    window.localStorage.setItem('web3account', accounts[0])
    this.setState({ isLoading: false })
    
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }
    this.getDetails()
    this.loadPendingBanks()
    this.loadPendingSurveyors()
  }

  loadPendingBanks = async () => {
    this.setState({ loadingBanks: true })
    try {
      const response = await axios.get('http://localhost:3001/pending_banks')
      this.setState({ pendingBanks: response.data || [], loadingBanks: false })
    } catch (error) {
      console.error('Error loading pending banks:', error)
      this.setState({ loadingBanks: false })
    }
  }

  loadPendingSurveyors = async () => {
    this.setState({ loadingSurveyors: true })
    try {
      const response = await axios.get('http://localhost:3001/pending_surveyors')
      this.setState({ pendingSurveyors: response.data || [], loadingSurveyors: false })
    } catch (error) {
      console.error('Error loading pending surveyors:', error)
      this.setState({ loadingSurveyors: false })
    }
  }

  handleApproveBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to approve this bank?')) {
      return
    }

    try {
      await axios.put(`http://localhost:3001/approve_bank/${bankId}`, {
        approvedBy: this.state.username
      })
      
      alert('Bank approved successfully!')
      await this.loadPendingBanks()
    } catch (error) {
      console.error('Error approving bank:', error)
      alert('Failed to approve bank. Please try again.')
    }
  }

  handleRejectBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to reject this bank? This action cannot be undone.')) {
      return
    }

    try {
      await axios.put(`http://localhost:3001/reject_bank/${bankId}`)
      
      alert('Bank rejected.')
      await this.loadPendingBanks()
    } catch (error) {
      console.error('Error rejecting bank:', error)
      alert('Failed to reject bank. Please try again.')
    }
  }

  handleApproveSurveyor = async (surveyorId) => {
    if (!window.confirm('Are you sure you want to approve this surveyor?')) {
      return
    }

    try {
      await axios.put(`http://localhost:3001/approve_surveyor/${surveyorId}`, {
        approvedBy: this.state.username
      })
      
      alert('Surveyor approved successfully!')
      await this.loadPendingSurveyors()
    } catch (error) {
      console.error('Error approving surveyor:', error)
      alert('Failed to approve surveyor. Please try again.')
    }
  }

  handleRejectSurveyor = async (surveyorId) => {
    if (!window.confirm('Are you sure you want to reject this surveyor? This action cannot be undone.')) {
      return
    }

    try {
      await axios.put(`http://localhost:3001/reject_surveyor/${surveyorId}`)
      
      alert('Surveyor rejected.')
      await this.loadPendingSurveyors()
    } catch (error) {
      console.error('Error rejecting surveyor:', error)
      alert('Failed to reject surveyor. Please try again.')
    }
  }

  handleTabChange = (tabIndex) => {
    this.setState({ activeTab: tabIndex })
  }

  async propertyDetails(property) {
    let details = await this.state.landList.methods
      .landInfoOwner(property)
      .call()
    ipfs.cat(details[1], (err, res) => {
      if (err) {
        console.error(err)
        return
      }
      const temp = JSON.parse(res.toString())
      this.state.assetList.push({
        property: property,
        uniqueID: details[1],
        name: temp.name,
        key: details[0],
        email: temp.email,
        contact: temp.contact,
        pan: temp.pan,
        occupation: temp.occupation,
        oaddress: temp.address,
        ostate: temp.state,
        ocity: temp.city,
        opostalCode: temp.postalCode,
        laddress: temp.laddress,
        lstate: temp.lstate,
        lcity: temp.lcity,
        lpostalCode: temp.lpostalCode,
        larea: temp.larea,
        lamount: details[2],
        isGovtApproved: details[3],
        isAvailable: details[4],
        requester: details[5],
        requestStatus: details[6],
        document: temp.document,
        images: temp.images,
      })
      this.setState({ assetList: [...this.state.assetList] })
    })
  }

  async getDetails() {
    const properties = await this.state.landList.methods.Assets().call()
    for (let item of properties) {
      this.propertyDetails(item)
    }
  }

  getStats() {
    const total = this.state.assetList.length
    const pending = this.state.assetList.filter(item => item.isGovtApproved === 'Not Approved').length
    const approved = this.state.assetList.filter(item => item.isGovtApproved === 'Approved').length
    const rejected = this.state.assetList.filter(item => item.isGovtApproved === 'Rejected').length
    
    return { total, pending, approved, rejected }
  }

  render() {
    const stats = this.getStats()
    
    return this.state.isLoading ? (
      <LoadingContainer>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader />
        </LoadingSpinner>
        <LoadingText>Loading government dashboard...</LoadingText>
      </LoadingContainer>
    ) : (
      <PageContainer>
        <Container>
          <PageHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeaderTop>
              <TitleSection>
                <Title>
                  Government Dashboard
                  <GovBadge>
                    <FiShield /> Official Portal
                  </GovBadge>
                </Title>
                <Subtitle>
                  Review and approve property registrations | {this.state.username}
                </Subtitle>
              </TitleSection>
            </HeaderTop>
          </PageHeader>

          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              borderColor="#e5e7eb"
            >
              <StatLabel>Total Applications</StatLabel>
              <StatValue color="#1f2937">
                <FiShield />
                {stats.total}
              </StatValue>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              borderColor="#fef3c7"
            >
              <StatLabel>Pending Review</StatLabel>
              <StatValue color="#d97706">
                <FiAlertCircle />
                {stats.pending}
              </StatValue>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              borderColor="#d1fae5"
            >
              <StatLabel>Approved</StatLabel>
              <StatValue color="#059669">
                <FiCheckCircle />
                {stats.approved}
              </StatValue>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              borderColor="#fee2e2"
            >
              <StatLabel>Rejected</StatLabel>
              <StatValue color="#dc2626">
                <FiAlertCircle />
                {stats.rejected}
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
                <FiShield /> Property Registrations
              </Tab>
              <Tab
                active={this.state.activeTab === 1}
                onClick={() => this.handleTabChange(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiBriefcase /> Bank Approvals ({this.state.pendingBanks.length})
              </Tab>
              <Tab
                active={this.state.activeTab === 2}
                onClick={() => this.handleTabChange(2)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiAward /> Surveyor Approvals ({this.state.pendingSurveyors.length})
              </Tab>
            </TabsHeader>
            <TabContent>
              {this.state.activeTab === 0 && (
                <TableContainer>
                  <TableHeader>
                    <TableTitle>Property Registration Applications</TableTitle>
                    <TableSubtitle>
                      Review documents and approve or reject property registrations
                    </TableSubtitle>
                  </TableHeader>
                  
                  {this.state.assetList.length > 0 ? (
                    <Table assetList={this.state.assetList} />
                  ) : (
                    <EmptyState>
                      <EmptyIcon>
                        <FiShield />
                      </EmptyIcon>
                      <EmptyText>No Applications Yet</EmptyText>
                      <EmptySubtext>
                        Property registration applications will appear here for review
                      </EmptySubtext>
                    </EmptyState>
                  )}
                </TableContainer>
              )}

              {this.state.activeTab === 1 && (
                <div>
                  <TableHeader>
                    <TableTitle>Pending Bank Registrations</TableTitle>
                    <TableSubtitle>
                      Review and approve bank registrations
                    </TableSubtitle>
                  </TableHeader>
                  
                  {this.state.loadingBanks ? (
                    <LoadingContainer>
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <FiLoader />
                      </LoadingSpinner>
                      <LoadingText>Loading banks...</LoadingText>
                    </LoadingContainer>
                  ) : this.state.pendingBanks.length > 0 ? (
                    this.state.pendingBanks.map((bank, index) => (
                      <ApprovalCard
                        key={bank._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CardHeader>
                          <div>
                            <CardTitle>{bank.bankName}</CardTitle>
                            <CardSubtitle>License: {bank.licenseNumber}</CardSubtitle>
                          </div>
                        </CardHeader>
                        <CardDetails>
                          <DetailItem>
                            <DetailLabel>Email</DetailLabel>
                            <DetailValue>{bank.email}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Contact</DetailLabel>
                            <DetailValue>{bank.contact}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Address</DetailLabel>
                            <DetailValue>{bank.bankAddress}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Ethereum Address</DetailLabel>
                            <DetailValue style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                              {bank.ethereumAddress}
                            </DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Registered On</DetailLabel>
                            <DetailValue>{new Date(bank.createdAt).toLocaleDateString()}</DetailValue>
                          </DetailItem>
                        </CardDetails>
                        <ActionButtons>
                          <Button
                            variant="success"
                            onClick={() => this.handleApproveBank(bank._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiCheckCircle /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => this.handleRejectBank(bank._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiXCircle /> Reject
                          </Button>
                        </ActionButtons>
                      </ApprovalCard>
                    ))
                  ) : (
                    <EmptyState>
                      <EmptyIcon>
                        <FiBriefcase />
                      </EmptyIcon>
                      <EmptyText>No Pending Banks</EmptyText>
                      <EmptySubtext>
                        All bank registrations have been reviewed
                      </EmptySubtext>
                    </EmptyState>
                  )}
                </div>
              )}

              {this.state.activeTab === 2 && (
                <div>
                  <TableHeader>
                    <TableTitle>Pending Surveyor Registrations</TableTitle>
                    <TableSubtitle>
                      Review and approve surveyor registrations
                    </TableSubtitle>
                  </TableHeader>
                  
                  {this.state.loadingSurveyors ? (
                    <LoadingContainer>
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <FiLoader />
                      </LoadingSpinner>
                      <LoadingText>Loading surveyors...</LoadingText>
                    </LoadingContainer>
                  ) : this.state.pendingSurveyors.length > 0 ? (
                    this.state.pendingSurveyors.map((surveyor, index) => (
                      <ApprovalCard
                        key={surveyor._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CardHeader>
                          <div>
                            <CardTitle>{surveyor.name}</CardTitle>
                            <CardSubtitle>License: {surveyor.licenseNumber}</CardSubtitle>
                          </div>
                        </CardHeader>
                        <CardDetails>
                          <DetailItem>
                            <DetailLabel>Email</DetailLabel>
                            <DetailValue>{surveyor.email}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Contact</DetailLabel>
                            <DetailValue>{surveyor.contact}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Specialization</DetailLabel>
                            <DetailValue>{surveyor.specialization}</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Experience</DetailLabel>
                            <DetailValue>{surveyor.experienceYears} years</DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Ethereum Address</DetailLabel>
                            <DetailValue style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                              {surveyor.ethereumAddress}
                            </DetailValue>
                          </DetailItem>
                          <DetailItem>
                            <DetailLabel>Registered On</DetailLabel>
                            <DetailValue>{new Date(surveyor.createdAt).toLocaleDateString()}</DetailValue>
                          </DetailItem>
                        </CardDetails>
                        <ActionButtons>
                          <Button
                            variant="success"
                            onClick={() => this.handleApproveSurveyor(surveyor._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiCheckCircle /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => this.handleRejectSurveyor(surveyor._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiXCircle /> Reject
                          </Button>
                        </ActionButtons>
                      </ApprovalCard>
                    ))
                  ) : (
                    <EmptyState>
                      <EmptyIcon>
                        <FiAward />
                      </EmptyIcon>
                      <EmptyText>No Pending Surveyors</EmptyText>
                      <EmptySubtext>
                        All surveyor registrations have been reviewed
                      </EmptySubtext>
                    </EmptyState>
                  )}
                </div>
              )}
            </TabContent>
          </TabsContainer>
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Dashboard)
