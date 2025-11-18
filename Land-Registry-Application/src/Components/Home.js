import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { withRouter } from 'react-router-dom'
import Typewriter from 'react-typewriter-effect'
import { FiShield, FiUsers, FiTrendingUp, FiCheckCircle, FiHome, FiArrowRight, FiLock, FiClock, FiBriefcase, FiDollarSign, FiAward, FiMapPin } from 'react-icons/fi'

const HeroContainer = styled.div`
  min-height: 100vh;
  background: white;
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
    background: rgba(79, 70, 229, 0.05);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -10%;
    width: 800px;
    height: 800px;
    background: rgba(79, 70, 229, 0.05);
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
  color: #1f2937;
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
  background: #4f46e5;
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
    background: #4f46e5;
    color: white;
    
    &:hover {
      background: #4338ca;
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
    }
  ` : `
    background: transparent;
    color: #4f46e5;
    border: 2px solid #4f46e5;
    
    &:hover {
      background: #4f46e5;
      color: white;
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
  background: #f9fafb;
  border-radius: 16px;
  padding: 30px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: translateY(-5px);
    border-color: #4f46e5;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
  }
  
  ${props => props.large && `
    grid-column: 1 / -1;
  `}
`

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: #4f46e515;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 28px;
  color: #4f46e5;
`

const FeatureTitle = styled.h3`
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`

const FeatureDescription = styled.p`
  color: #6b7280;
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
  color: #1f2937;
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
`

const StatIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  color: #4f46e5;
  
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

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: white;
  border-top: 2px solid #e5e7eb;
  min-height: 400px;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
`

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #374151;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`

const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.15);
  }
`

const ServiceIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${props => props.color ? `${props.color}15` : '#4f46e515'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 32px;
  color: ${props => props.color || '#4f46e5'};
`

const ServiceTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`

const ServiceDescription = styled.p`
  font-size: 15px;
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
  font-weight: 400;
`

const UserTypesSection = styled.section`
  padding: 80px 20px;
  background: white;
  border-top: 2px solid #e5e7eb;
  min-height: 400px;
`

const UserTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
`

const UserTypeCard = styled(motion.div)`
  background: #f9fafb;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`

const UserTypeIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.color ? `${props.color}15` : '#4f46e515'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: ${props => props.color || '#4f46e5'};
`

const UserTypeTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`

const UserTypeDescription = styled.p`
  font-size: 15px;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 24px;
  font-weight: 400;
`

const UserTypeButton = styled.button`
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  svg {
    font-size: 16px;
  }
`

class Home extends Component {
  render() {
    return (
      <>
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
                textStyle={{ color: '#6b7280', fontWeight: 400 }}
                startDelay={500}
                cursorColor="#4f46e5"
                multiText={[
                  'Trustable, Transparent and Digitized Platform',
                  'Powered by Blockchain Technology',
                  'Secure Property Registration with Mortgage & Survey',
                  'Bank Loans & Professional Surveys Available',
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
      
      <FeaturesSection>
        <Container>
          <SectionHeader
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>Our Services</SectionTitle>
            <SectionSubtitle>Comprehensive land registry solutions powered by blockchain</SectionSubtitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <ServiceCard
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <ServiceIcon color="#4f46e5">
                <FiShield />
              </ServiceIcon>
              <ServiceTitle>Property Registration</ServiceTitle>
              <ServiceDescription>
                Register your property on the blockchain with government verification. All documents stored securely on IPFS.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <ServiceIcon color="#10b981">
                <FiBriefcase />
              </ServiceIcon>
              <ServiceTitle>Bank Mortgage</ServiceTitle>
              <ServiceDescription>
                Apply for mortgage loans against your property. Banks can manage loans with automatic lien tracking on blockchain.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <ServiceIcon color="#f59e0b">
                <FiAward />
              </ServiceIcon>
              <ServiceTitle>Property Survey</ServiceTitle>
              <ServiceDescription>
                Request professional property surveys from certified surveyors. All survey reports verified by government.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <ServiceIcon color="#ef4444">
                <FiCheckCircle />
              </ServiceIcon>
              <ServiceTitle>Property Transfer</ServiceTitle>
              <ServiceDescription>
                Buy and sell properties seamlessly. Smart contracts handle ownership transfer automatically and securely.
              </ServiceDescription>
            </ServiceCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
      
      <UserTypesSection>
        <Container>
          <SectionHeader
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>For Everyone</SectionTitle>
            <SectionSubtitle>Join our blockchain-powered land registry platform</SectionSubtitle>
          </SectionHeader>
          
          <UserTypesGrid>
            <UserTypeCard
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <UserTypeIcon color="#4f46e5">
                <FiUsers />
              </UserTypeIcon>
              <UserTypeTitle>Property Owners</UserTypeTitle>
              <UserTypeDescription>
                Register your property, apply for mortgages, request surveys, and manage your assets
              </UserTypeDescription>
              <UserTypeButton onClick={() => this.props.history.push('/signup')}>
                Register Now <FiArrowRight />
              </UserTypeButton>
            </UserTypeCard>
            
            <UserTypeCard
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <UserTypeIcon color="#10b981">
                <FiBriefcase />
              </UserTypeIcon>
              <UserTypeTitle>Banks</UserTypeTitle>
              <UserTypeDescription>
                Provide mortgage services, review applications, and manage loans with blockchain security
              </UserTypeDescription>
              <UserTypeButton onClick={() => this.props.history.push('/bank_register')}>
                Bank Registration <FiArrowRight />
              </UserTypeButton>
            </UserTypeCard>
            
            <UserTypeCard
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <UserTypeIcon color="#f59e0b">
                <FiAward />
              </UserTypeIcon>
              <UserTypeTitle>Surveyors</UserTypeTitle>
              <UserTypeDescription>
                Conduct property surveys, submit reports, and get government verification
              </UserTypeDescription>
              <UserTypeButton onClick={() => this.props.history.push('/surveyor_register')}>
                Surveyor Registration <FiArrowRight />
              </UserTypeButton>
            </UserTypeCard>
            
            <UserTypeCard
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <UserTypeIcon color="#dc2626">
                <FiShield />
              </UserTypeIcon>
              <UserTypeTitle>Government</UserTypeTitle>
              <UserTypeDescription>
                Verify property registrations, approve banks and surveyors, and maintain registry integrity
              </UserTypeDescription>
              <UserTypeButton onClick={() => this.props.history.push('/govt_login')}>
                Government Login <FiArrowRight />
              </UserTypeButton>
            </UserTypeCard>
          </UserTypesGrid>
        </Container>
      </UserTypesSection>
      </>
    )
  }
}

export default withRouter(Home)
