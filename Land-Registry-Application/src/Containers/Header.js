import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiHome, FiLogIn, FiUserPlus, FiUser, FiLogOut, FiGrid, FiHelpCircle, FiShield } from 'react-icons/fi'
import Land from '../abis/LandRegistry.json'

const HeaderContainer = styled(motion.header)`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e5e7eb;
`

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #4f46e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`

const LogoText = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 968px) {
    display: none;
  }
`

const NavButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.$primary ? '#4f46e5' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#4b5563'};
  border: ${props => props.$primary ? 'none' : '2px solid transparent'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$primary ? '#4338ca' : '#f3f4f6'};
    color: ${props => props.$primary ? 'white' : '#1f2937'};
  }
  
  svg {
    font-size: 18px;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #4b5563;
  cursor: pointer;
  padding: 8px;
  
  @media (max-width: 968px) {
    display: block;
  }
`

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  gap: 12px;
  flex-direction: column;
  
  @media (max-width: 968px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`

const MobileNavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: ${props => props.$primary ? '#4f46e5' : '#f9fafb'};
  color: ${props => props.$primary ? 'white' : '#4b5563'};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.$primary ? '#4338ca' : '#f3f4f6'};
  }
  
  svg {
    font-size: 18px;
  }
`

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      mobileMenuOpen: false,
      userType: 'user',
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
    if (window.localStorage.getItem('authenticated') === 'true') {
      this.setState({ 
        authenticated: true,
        userType: window.localStorage.getItem('userType') || 'user'
      })
    }
  }

  toggleMobileMenu = () => {
    this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen })
  }

  handleLogout = () => {
    window.localStorage.setItem('authenticated', false)
    window.localStorage.removeItem('userType')
    window.localStorage.removeItem('token')
    window.location = '/'
  }

  render() {
    return (
      <>
        <HeaderContainer
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Nav>
            <Logo onClick={() => window.location = '/'}>
              <LogoIcon>
                <FiHome />
              </LogoIcon>
              <LogoText>Land Registry</LogoText>
            </Logo>

            <NavItems>
              <NavButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location = '/'}
              >
                <FiHome /> Home
              </NavButton>

              {!this.state.authenticated && (
                <>
                  <NavButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location = '/login'}
                  >
                    <FiLogIn /> Login
                  </NavButton>
                  <NavButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location = '/signup'}
                  >
                    <FiUserPlus /> Sign Up
                  </NavButton>
                  <NavButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location = '/govt_login'}
                  >
                    <FiShield /> Government
                  </NavButton>
                </>
              )}

              {this.state.authenticated && (
                <>
                  <NavButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location = this.state.userType === 'government' ? '/dashboard_govt' : '/dashboard'}
                  >
                    <FiGrid /> Dashboard
                  </NavButton>
                  {this.state.userType !== 'government' && (
                    <NavButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location = '/profile'}
                    >
                      <FiUser /> Profile
                    </NavButton>
                  )}
                  <NavButton
                    $primary
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleLogout}
                  >
                    <FiLogOut /> Logout
                  </NavButton>
                </>
              )}

              <NavButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location = '/guide'}
              >
                <FiHelpCircle /> FAQ
              </NavButton>
            </NavItems>

            <MobileMenuButton onClick={this.toggleMobileMenu}>
              {this.state.mobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </Nav>
        </HeaderContainer>

        <MobileMenu
          isOpen={this.state.mobileMenuOpen}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: this.state.mobileMenuOpen ? 1 : 0,
            y: this.state.mobileMenuOpen ? 0 : -20
          }}
          transition={{ duration: 0.3 }}
        >
          <MobileNavButton onClick={() => window.location = '/'}>
            <FiHome /> Home
          </MobileNavButton>

          {!this.state.authenticated && (
            <>
              <MobileNavButton onClick={() => window.location = '/login'}>
                <FiLogIn /> Login
              </MobileNavButton>
              <MobileNavButton onClick={() => window.location = '/signup'}>
                <FiUserPlus /> Sign Up
              </MobileNavButton>
              <MobileNavButton onClick={() => window.location = '/govt_login'}>
                <FiShield /> Government Login
              </MobileNavButton>
            </>
          )}

          {this.state.authenticated && (
            <>
              <MobileNavButton onClick={() => window.location = this.state.userType === 'government' ? '/dashboard_govt' : '/dashboard'}>
                <FiGrid /> Dashboard
              </MobileNavButton>
              {this.state.userType !== 'government' && (
                <MobileNavButton onClick={() => window.location = '/profile'}>
                  <FiUser /> Profile
                </MobileNavButton>
              )}
              <MobileNavButton $primary onClick={this.handleLogout}>
                <FiLogOut /> Logout
              </MobileNavButton>
            </>
          )}

          <MobileNavButton onClick={() => window.location = '/guide'}>
            <FiHelpCircle /> FAQ
          </MobileNavButton>
        </MobileMenu>
      </>
    )
  }
}

export default Header
