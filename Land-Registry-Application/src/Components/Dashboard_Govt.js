import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiShield, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { withRouter } from 'react-router-dom'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'
import Table from '../Containers/Govt_Table'
import Web3 from 'web3'
import jwtDecode from 'jwt-decode'

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

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
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
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Dashboard)
