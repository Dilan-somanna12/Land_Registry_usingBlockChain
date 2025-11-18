import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiGrid, FiHome, FiPlus, FiLoader } from 'react-icons/fi'
import { withRouter } from 'react-router-dom'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'
import Table from '../Containers/Owner_Table'
import AvailableTable from '../Containers/Buyer_Table'
import RegistrationForm from '../Containers/RegistrationForm'

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

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetList: [],
      assetList1: [],
      isLoading: true,
      value: 0,
    }
  }

  componentDidMount = async () => {
    // Check if government user - redirect to government dashboard
    const userType = window.localStorage.getItem('userType')
    if (userType === 'government') {
      this.props.history.push('/dashboard_govt')
      return
    }

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    await window.localStorage.setItem('web3account', accounts[0])
    this.setState({ account: accounts[0] })
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

    if (
      !window.localStorage.getItem('authenticated') ||
      window.localStorage.getItem('authenticated') === 'false'
    )
      this.props.history.push('/login')
    this.setState({ isLoading: false })
    this.getDetails()
    this.getDetails1()
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

  async propertyDetails1(property) {
    try {
      let details = await this.state.landList.methods
        .landInfoOwner(property)
        .call()
      
      // Convert details to strings for comparison
      const owner = String(details[0]).toLowerCase()
      const currentAccount = String(this.state.account).toLowerCase()
      const isAvailable = String(details[4]).trim()
      const requester = String(details[5]).toLowerCase()
      
      // Debug: Log property details
      console.log('Property', property, 'Details:', {
        owner: owner,
        currentAccount: currentAccount,
        isAvailable: isAvailable,
        requester: requester,
        ownerMatch: owner !== currentAccount,
        isAvailableCheck: isAvailable === 'Available',
        isApprovedCheck: isAvailable === 'Approved' && requester === currentAccount
      })

      // Check if property should be shown BEFORE IPFS call
      const shouldShow = owner !== currentAccount &&
        (isAvailable === 'Available' ||
          (isAvailable === 'Approved' && requester === currentAccount))
      
      if (!shouldShow) {
        console.log('Property', property, 'filtered out - not available or owned by user')
        return
      }

      // Fetch IPFS data
      ipfs.cat(details[1], (err, res) => {
        if (err) {
          console.error('IPFS error for property', property, err)
          // Still add property even if IPFS fails, with minimal data
          const newProperty = {
            property: property,
            uniqueID: details[1],
            name: 'Loading...',
            key: details[0],
            email: '',
            contact: '',
            pan: '',
            occupation: '',
            oaddress: '',
            ostate: '',
            ocity: '',
            opostalCode: '',
            laddress: 'IPFS data unavailable',
            lstate: '',
            lcity: '',
            lpostalCode: '',
            larea: '',
            lamount: details[2],
            isGovtApproved: details[3],
            isAvailable: details[4],
            requester: details[5],
            requestStatus: details[6],
            document: '',
            images: [],
          }
          this.setState(prevState => ({
            assetList1: [...prevState.assetList1, newProperty]
          }))
          return
        }
        
        try {
          const temp = JSON.parse(res.toString())
          
          const newProperty = {
            property: property,
            uniqueID: details[1],
            name: temp.name || 'N/A',
            key: details[0],
            email: temp.email || '',
            contact: temp.contact || '',
            pan: temp.pan || '',
            occupation: temp.occupation || '',
            oaddress: temp.address || '',
            ostate: temp.state || '',
            ocity: temp.city || '',
            opostalCode: temp.postalCode || '',
            laddress: temp.laddress || '',
            lstate: temp.lstate || '',
            lcity: temp.lcity || '',
            lpostalCode: temp.lpostalCode || '',
            larea: temp.larea || '',
            lamount: details[2],
            isGovtApproved: details[3],
            isAvailable: details[4],
            requester: details[5],
            requestStatus: details[6],
            document: temp.document || '',
            images: temp.images || [],
          }
          
          console.log('Adding property to available list:', property, newProperty.name)
          this.setState(prevState => ({
            assetList1: [...prevState.assetList1, newProperty]
          }))
        } catch (parseError) {
          console.error('Error parsing IPFS data for property', property, parseError)
        }
      })
    } catch (error) {
      console.error('Error fetching property details for', property, error)
    }
  }

  async getDetails() {
    const properties = await this.state.landList.methods
      .viewAssets()
      .call({ from: this.state.account })
    for (let item of properties) {
      this.propertyDetails(item)
    }
  }

  async getDetails1() {
    const properties = await this.state.landList.methods.Assets().call()
    console.log('getDetails1 - Total properties found:', properties.length)
    this.setState({ assetList1: [] }) // Clear previous list
    for (let item of properties) {
      this.propertyDetails1(item)
    }
  }

  handleChange = async (newValue) => {
    this.setState({ value: newValue })
    // Refresh available properties when switching to that tab
    if (newValue === 1) {
      console.log('Switching to Available Properties tab - refreshing data...')
      this.setState({ assetList1: [] })
      // Small delay to ensure state is cleared before fetching
      setTimeout(() => {
        this.getDetails1()
      }, 100)
    }
  }

  render() {
    return this.state.isLoading ? (
      <LoadingContainer>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader />
        </LoadingSpinner>
        <LoadingText>Loading your dashboard...</LoadingText>
      </LoadingContainer>
    ) : (
      <PageContainer>
        <Container>
          <PageHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title>Dashboard</Title>
            <Subtitle>Manage your properties and explore available listings</Subtitle>
          </PageHeader>

          <TabsContainer>
            <TabsHeader>
              <Tab
                active={this.state.value === 0}
                onClick={() => this.handleChange(0)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiHome /> My Properties
              </Tab>
              <Tab
                active={this.state.value === 1}
                onClick={() => this.handleChange(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiGrid /> Available Properties
              </Tab>
              <Tab
                active={this.state.value === 2}
                onClick={() => this.handleChange(2)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus /> Register Land
              </Tab>
            </TabsHeader>

            {this.state.value === 0 && (
              <TabContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table assetList={this.state.assetList} />
              </TabContent>
            )}

            {this.state.value === 1 && (
              <TabContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AvailableTable assetList={this.state.assetList1} />
              </TabContent>
            )}

            {this.state.value === 2 && (
              <TabContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegistrationForm />
              </TabContent>
            )}
          </TabsContainer>
        </Container>
      </PageContainer>
    )
  }
}

export default withRouter(Dashboard)
