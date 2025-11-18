import React, { Component } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiShield, 
  FiCheckCircle, FiBriefcase, FiCreditCard, FiDollarSign,
  FiMaximize, FiUpload, FiFile, FiImage
} from 'react-icons/fi'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'

const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const SectionCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
`

const SectionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #4f46e5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const InputGroup = styled.div`
  ${props => props.$fullWidth && `
    grid-column: 1 / -1;
  `}
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
  border: 2px solid ${props => props.disabled ? '#e5e7eb' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: ${props => props.disabled ? '#f9fafb' : 'white'};
  color: ${props => props.disabled ? '#9ca3af' : '#1f2937'};
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

const FileUploadSection = styled.div`
  margin-top: 20px;
`

const FileUploadLabel = styled.label`
  display: block;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const FileInput = styled.input`
  display: none;
`

const FileUploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f3f4f6;
  color: #4b5563;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e5e7eb;
    border-color: #4f46e5;
    color: #4f46e5;
  }
`

const FilePreview = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`

const ImagePreview = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  margin: 24px 0;
`

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4f46e5;
`

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
`

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: ${props => props.disabled ? '#9ca3af' : '#4f46e5'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.disabled ? '#9ca3af' : '#4338ca'};
    box-shadow: ${props => props.disabled ? 'none' : '0 8px 20px rgba(79, 70, 229, 0.3)'};
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

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      pan: '',
      occupation: '',
      state: '',
      address: '',
      postalCode: '',
      city: '',
      contact: '',
      laddress: '',
      lstate: '',
      lcity: '',
      lamount: '',
      larea: '',
      lpostalCode: '',
      ipfsHash: '',
      checked: false,
      buffer: null,
      images: [],
      image: [],
      account: '',
      landList: null,
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
    if (
      !window.localStorage.getItem('authenticated') ||
      window.localStorage.getItem('authenticated') === 'false'
    )
      this.props.history.push('/login')
  }

  validateEmail = (emailField) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (reg.test(emailField) === false) {
      return false
    }
    return true
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  handleChangeCheckbox = (event) => {
    this.setState({ checked: !this.state.checked })
  }

  async propertyID(laddress, lamount) {
    const propertyId = await this.state.landList.methods
      .computeId(laddress, lamount)
      .call()
    this.setState({ propertyId })
  }

  async Register(data, account, laddress, lamount) {
    var buf = Buffer.from(JSON.stringify(data))
    ipfs.files.add(buf, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      this.state.landList.methods
        .Registration(
          account,
          result[0].hash,
          laddress,
          lamount,
          this.state.propertyId,
          'Not Approved',
          'Not yet approved by the govt.',
        )
        .send({
          from: this.state.account,
          gas: 1000000,
        })
        .on('receipt', function (receipt) {
          if (!receipt) {
            console.log('Transaction Failed!!!')
          } else {
            window.alert('Property registered successfully! Pending government approval.')
            window.location = '/dashboard'
          }
        })
      this.setState({ ipfsHash: result[0].hash })
    })
  }

  handleSubmit = () => {
    const account = this.state.account
    const laddress = this.state.laddress
    const lamount = this.state.lamount

    let data = {
      name: this.state.name,
      email: this.state.email,
      contact: this.state.contact,
      pan: this.state.pan,
      address: this.state.address,
      state: this.state.state,
      city: this.state.city,
      postalCode: this.state.postalCode,
      occupation: this.state.occupation,
      laddress: this.state.laddress,
      lstate: this.state.lstate,
      lcity: this.state.lcity,
      lpostalCode: this.state.lpostalCode,
      larea: this.state.larea,
      document: this.state.buffer,
      images: this.state.image,
    }
    
    if (data) {
      try {
        this.propertyID(laddress, lamount)
        this.Register(data, account, laddress, lamount)
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      window.alert('All fields are required.')
    }
  }

  onChange = (e) => {
    const file = e.target.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.setState({ buffer: reader.result })
    }
  }

  fileSelectedHandler = async (e) => {
    await this.setState({ images: [...e.target.files] })
    for (let i = 0; i < this.state.images.length; i++) {
      const file = this.state.images[i]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.setState({ image: [...this.state.image, e.target.result] })
      }
    }
  }

  render() {
    return (
      <FormContainer>
        <SectionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader>
            <SectionIcon><FiUser /></SectionIcon>
            <SectionTitle>Owner Information</SectionTitle>
          </SectionHeader>

          <GridContainer>
            <InputGroup>
              <Label>Owner's Name</Label>
              <InputWrapper>
                <IconContainer><FiUser /></IconContainer>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Email Address</Label>
              <InputWrapper>
                <IconContainer><FiMail /></IconContainer>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Contact Number</Label>
              <InputWrapper>
                <IconContainer><FiPhone /></IconContainer>
                <Input
                  type="tel"
                  placeholder="10-digit number"
                  value={this.state.contact}
                  onChange={this.handleChange('contact')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>PAN Number</Label>
              <InputWrapper>
                <IconContainer><FiCreditCard /></IconContainer>
                <Input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={this.state.pan}
                  onChange={this.handleChange('pan')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Occupation</Label>
              <InputWrapper>
                <IconContainer><FiBriefcase /></IconContainer>
                <Input
                  type="text"
                  placeholder="Your occupation"
                  value={this.state.occupation}
                  onChange={this.handleChange('occupation')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>City</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Your city"
                  value={this.state.city}
                  onChange={this.handleChange('city')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup $fullWidth>
              <Label>Permanent Address</Label>
              <InputWrapper>
                <IconContainer><FiHome /></IconContainer>
                <Input
                  type="text"
                  placeholder="Complete address"
                  value={this.state.address}
                  onChange={this.handleChange('address')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>State</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleChange('state')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Postal Code</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="6-digit code"
                  value={this.state.postalCode}
                  onChange={this.handleChange('postalCode')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup $fullWidth>
              <Label>Ethereum Address</Label>
              <InputWrapper>
                <IconContainer><FiShield /></IconContainer>
                <Input
                  type="text"
                  value={this.state.account}
                  disabled
                />
              </InputWrapper>
            </InputGroup>
          </GridContainer>
        </SectionCard>

        <SectionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionHeader>
            <SectionIcon><FiHome /></SectionIcon>
            <SectionTitle>Property Details</SectionTitle>
          </SectionHeader>

          <GridContainer>
            <InputGroup $fullWidth>
              <Label>Property Address</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Property identification address"
                  value={this.state.laddress}
                  onChange={this.handleChange('laddress')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>State</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Property state"
                  value={this.state.lstate}
                  onChange={this.handleChange('lstate')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>City</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Property city"
                  value={this.state.lcity}
                  onChange={this.handleChange('lcity')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Postal Code</Label>
              <InputWrapper>
                <IconContainer><FiMapPin /></IconContainer>
                <Input
                  type="text"
                  placeholder="Property postal code"
                  value={this.state.lpostalCode}
                  onChange={this.handleChange('lpostalCode')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Area (sq meters)</Label>
              <InputWrapper>
                <IconContainer><FiMaximize /></IconContainer>
                <Input
                  type="number"
                  placeholder="Total area"
                  value={this.state.larea}
                  onChange={this.handleChange('larea')}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Price (ETH)</Label>
              <InputWrapper>
                <IconContainer><FiDollarSign /></IconContainer>
                <Input
                  type="number"
                  placeholder="Property price in ETH"
                  value={this.state.lamount}
                  onChange={this.handleChange('lamount')}
                />
              </InputWrapper>
            </InputGroup>
          </GridContainer>

          <FileUploadSection>
            <FileUploadLabel>
              <FiFile /> Upload Legal Documents
            </FileUploadLabel>
            <FileInput
              id="doc-upload"
              type="file"
              onChange={this.onChange}
            />
            <FileUploadButton htmlFor="doc-upload">
              <FiUpload /> Choose Document
            </FileUploadButton>
            {this.state.buffer && (
              <FilePreview>
                <iframe 
                  src={this.state.buffer}
                  style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
                  title="Document Preview"
                />
              </FilePreview>
            )}
          </FileUploadSection>

          <FileUploadSection>
            <FileUploadLabel>
              <FiImage /> Upload Property Images
            </FileUploadLabel>
            <FileInput
              id="image-upload"
              type="file"
              multiple
              onChange={this.fileSelectedHandler}
            />
            <FileUploadButton htmlFor="image-upload">
              <FiUpload /> Choose Images
            </FileUploadButton>
            {this.state.images.length > 0 && (
              <ImageGrid>
                {[...this.state.images].map((file, index) => (
                  <ImagePreview
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Property ${index + 1}`}
                  />
                ))}
              </ImageGrid>
            )}
          </FileUploadSection>
        </SectionCard>

        <CheckboxWrapper>
          <Checkbox
            type="checkbox"
            id="terms"
            checked={this.state.checked}
            onChange={this.handleChangeCheckbox}
          />
          <CheckboxLabel htmlFor="terms">
            I agree to the Terms and Conditions and certify that all information provided is accurate
          </CheckboxLabel>
        </CheckboxWrapper>

        <SubmitButton
          whileHover={{ scale: this.state.checked ? 1.02 : 1 }}
          whileTap={{ scale: this.state.checked ? 0.98 : 1 }}
          onClick={this.handleSubmit}
          disabled={!this.state.checked}
        >
          <FiCheckCircle /> Submit Property Registration
        </SubmitButton>

        <Footer>
          Already registered? <a href="/dashboard">Check Status</a>
        </Footer>
      </FormContainer>
    )
  }
}

export default Register
