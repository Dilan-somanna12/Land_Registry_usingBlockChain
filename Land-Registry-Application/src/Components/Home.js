import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { withRouter } from 'react-router-dom'
import Typewriter from 'react-typewriter-effect'
import { FiShield, FiUsers, FiTrendingUp, FiCheckCircle, FiHome, FiArrowRight, FiLock, FiClock } from 'react-icons/fi'

const HeroContainer = styled.div`
  min-height: 100vh;
  background: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 800px;
    height: 800px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -10%;
    width: 800px;
    height: 800px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

const LeftSection = styled(motion.div)`
  color: white;
`

const Title = styled(motion.h1)`
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 42px;
  }
`

const TypewriterWrapper = styled.div`
  font-size: 24px;
  font-weight: 400;
  min-height: 80px;
  opacity: 0.95;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const Divider = styled(motion.div)`
  width: 100px;
  height: 6px;
  background: white;
  border-radius: 3px;
  margin-bottom: 40px;
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

const Button = styled(motion.button)`
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: white;
    color: #4f46e5;
    
    &:hover {
      background: #f9fafb;
      box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
    }
  ` : `
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
`

const RightSection = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  ${props => props.large && `
    grid-column: 1 / -1;
  `}
`

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 28px;
  color: white;
`

const FeatureTitle = styled.h3`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
`

const StatCard = styled(motion.div)`
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const StatIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

class Home extends Component {
  render() {
    return (
      <HeroContainer>
        <ContentWrapper>
          <LeftSection
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Land Registry Application
            </Title>
            
            <TypewriterWrapper>
              <Typewriter
                textStyle={{ color: 'white', fontWeight: 400 }}
                startDelay={500}
                cursorColor="white"
                multiText={[
                  'Trustable, Transparent and Digitized Platform',
                  'Powered by Blockchain Technology',
                  'Secure Property Registration',
                  'Open for all! Register Now',
                ]}
                multiTextDelay={2000}
                typeSpeed={50}
              />
            </TypewriterWrapper>
            
            <Divider
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            
            <ButtonGroup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                primary
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => this.props.history.push('/signup')}
              >
                <FiUsers /> Get Started
              </Button>
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => this.props.history.push('/login')}
              >
                <FiArrowRight /> Login
              </Button>
            </ButtonGroup>
            
            <StatsGrid>
              <StatCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <StatIcon><FiLock /></StatIcon>
                <StatLabel>Secure</StatLabel>
              </StatCard>
              <StatCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <StatIcon><FiTrendingUp /></StatIcon>
                <StatLabel>Fast</StatLabel>
              </StatCard>
              <StatCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <StatIcon><FiClock /></StatIcon>
                <StatLabel>24/7</StatLabel>
              </StatCard>
            </StatsGrid>
          </LeftSection>
          
          <RightSection
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FeatureCard
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <IconWrapper>
                <FiShield />
              </IconWrapper>
              <FeatureTitle>Blockchain Secured</FeatureTitle>
              <FeatureDescription>
                Your property records are immutably stored on the blockchain
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <IconWrapper>
                <FiCheckCircle />
              </IconWrapper>
              <FeatureTitle>Government Verified</FeatureTitle>
              <FeatureDescription>
                All registrations approved by authorized officials
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard
              large
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <IconWrapper>
                <FiTrendingUp />
              </IconWrapper>
              <FeatureTitle>Easy Property Transfer</FeatureTitle>
              <FeatureDescription>
                Transfer ownership seamlessly without intermediaries using smart contracts
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard
              large
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <IconWrapper>
                <FiHome />
              </IconWrapper>
              <FeatureTitle>Complete Transparency</FeatureTitle>
              <FeatureDescription>
                Track your property history and all transactions in real-time on the blockchain
              </FeatureDescription>
            </FeatureCard>
          </RightSection>
        </ContentWrapper>
      </HeroContainer>
    )
  }
}

export default withRouter(Home)
