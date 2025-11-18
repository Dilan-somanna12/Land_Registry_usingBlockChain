import React, { Component } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHelpCircle, FiChevronDown, FiUserPlus, FiHome, FiShoppingCart } from 'react-icons/fi'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
`

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 50px;
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
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
`

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FAQItem = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 2px solid ${props => props.isOpen ? '#4f46e5' : 'transparent'};
  transition: border-color 0.3s ease;
`

const FAQQuestion = styled.button`
  width: 100%;
  padding: 24px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
  transition: background 0.3s ease;
  
  &:hover {
    background: #f9fafb;
  }
`

const QuestionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`

const QuestionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #ede9fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 22px;
  flex-shrink: 0;
`

const QuestionText = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`

const ChevronIcon = styled(motion.div)`
  font-size: 24px;
  color: #9ca3af;
  display: flex;
`

const FAQAnswer = styled(motion.div)`
  padding: 0 24px 24px 88px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.7;
  
  @media (max-width: 768px) {
    padding: 0 24px 24px 24px;
  }
  
  ul {
    margin: 12px 0;
    padding-left: 20px;
    
    li {
      margin: 8px 0;
    }
  }
`

const HelpFooter = styled(motion.div)`
  margin-top: 50px;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const FooterTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`

const FooterText = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #4f46e5;
  color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
`

const faqData = [
  {
    id: 1,
    icon: FiUserPlus,
    question: 'How to enroll to this application?',
    answer: `Visit the signup page to register on the platform. You need to provide the following details:
      <ul>
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Contact Number</li>
        <li>Residential Address</li>
        <li>City</li>
        <li>Postal Code</li>
      </ul>
      Your MetaMask wallet will be automatically connected. After submitting the form, you will be redirected to the login page. The system will register your account on both the database and blockchain.`
  },
  {
    id: 2,
    icon: FiHome,
    question: 'What is the procedure to register the property?',
    answer: `To register a property, you must first login to your account. Follow these steps:
      <ul>
        <li>Navigate to the Dashboard</li>
        <li>Click on the "Register Land" tab</li>
        <li>Fill in all required details about the property and owner</li>
        <li>Upload legal documents and property images</li>
        <li>Submit the form for government verification</li>
      </ul>
      Your application will be reviewed by government authorities. Check the "My Properties" section to monitor your application status. If approved, you can make your land available for sale. If declined, you'll need to submit a new application with corrected information.`
  },
  {
    id: 3,
    icon: FiShoppingCart,
    question: 'How to buy a property?',
    answer: `To purchase a property, follow these steps:
      <ul>
        <li>Login to your account and navigate to Dashboard</li>
        <li>Go to the "Available Properties" tab</li>
        <li>Browse through available properties</li>
        <li>Send a purchase request to the land owner</li>
        <li>Wait for the owner to review and accept your request</li>
        <li>Once approved, complete the transaction using ETH from your wallet</li>
      </ul>
      The smart contract will automatically transfer ownership and funds. The previous owner's ownership will be removed, and you'll receive full ownership rights. You can check your wallet balance in the Profile section.`
  }
]

class Help extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openId: null
    }
  }

  toggleFAQ = (id) => {
    this.setState({ openId: this.state.openId === id ? null : id })
  }

  render() {
    return (
      <PageContainer>
        <Container>
          <Header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IconWrapper
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FiHelpCircle />
            </IconWrapper>
            <Title>Frequently Asked Questions</Title>
            <Subtitle>Everything you need to know about the platform</Subtitle>
          </Header>

          <FAQList>
            {faqData.map((faq, index) => (
              <FAQItem
                key={faq.id}
                isOpen={this.state.openId === faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <FAQQuestion onClick={() => this.toggleFAQ(faq.id)}>
                  <QuestionContent>
                    <QuestionIcon>
                      <faq.icon />
                    </QuestionIcon>
                    <QuestionText>{faq.question}</QuestionText>
                  </QuestionContent>
                  <ChevronIcon
                    animate={{ rotate: this.state.openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown />
                  </ChevronIcon>
                </FAQQuestion>
                
                <AnimatePresence>
                  {this.state.openId === faq.id && (
                    <FAQAnswer
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </AnimatePresence>
              </FAQItem>
            ))}
          </FAQList>

          <HelpFooter
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FooterTitle>Still have questions?</FooterTitle>
            <FooterText>
              Can't find the answer you're looking for? Feel free to reach out to our support team.
            </FooterText>
            <ContactButton href="/">
              <FiHelpCircle /> Back to Home
            </ContactButton>
          </HelpFooter>
        </Container>
      </PageContainer>
    )
  }
}

export default Help
