# Product Design Requirements (PDR)
## Bank Mortgage & Survey Features for Land Registry Application

**Version:** 1.0  
**Date:** November 18, 2025  
**Project:** Land Registry Application using Ethereum Blockchain

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Feature 1: Bank Mortgage System](#feature-1-bank-mortgage-system)
3. [Feature 2: Property Survey System](#feature-2-property-survey-system)
4. [Technical Architecture](#technical-architecture)
5. [Database Schema](#database-schema)
6. [Smart Contract Changes](#smart-contract-changes)
7. [API Endpoints](#api-endpoints)
8. [User Interface Design](#user-interface-design)
9. [Workflow Diagrams](#workflow-diagrams)
10. [Security Considerations](#security-considerations)
11. [Implementation Phases](#implementation-phases)

---

## Executive Summary

This document outlines the design and requirements for adding two major features to the Land Registry Blockchain Application:

1. **Bank Mortgage System**: Enables banks to provide loans against properties, track mortgage status, and manage liens on blockchain-registered properties.

2. **Property Survey System**: Allows certified surveyors to conduct property surveys, upload survey reports, and enables government verification of survey data.

### Current System Analysis

**Existing Components:**
- Smart Contract: `LandRegistry.sol` - Handles property registration, ownership, buying/selling
- Frontend: React with styled-components, Framer Motion
- Backend: Node.js/Express with MongoDB
- IPFS: Document storage
- User Types: Regular Users, Government

**Current Workflow:**
1. User Registration → 2. Property Registration → 3. Government Approval → 4. Make Available → 5. Request to Buy → 6. Owner Approves → 7. Purchase

---

## Feature 1: Bank Mortgage System

### 1.1 Overview

The Bank Mortgage System allows financial institutions to:
- Register as authorized banks
- Issue mortgage loans against blockchain-registered properties
- Track mortgage status (Active, Paid Off, Defaulted)
- Place liens on properties
- Transfer mortgage ownership
- View mortgage history

### 1.2 User Roles

**New User Type: Bank**
- Bank registration with verification
- Bank login credentials
- Bank dashboard
- Mortgage management interface

### 1.3 Functional Requirements

#### 1.3.1 Bank Registration
- **FR-BM-001**: Banks can register with:
  - Bank Name
  - Bank Address
  - Contact Information
  - License/Registration Number
  - Ethereum Address (for blockchain transactions)
  - Admin Contact Details
- **FR-BM-002**: Government must approve bank registration
- **FR-BM-003**: Approved banks receive unique Bank ID

#### 1.3.2 Mortgage Application
- **FR-BM-004**: Property owners can apply for mortgage:
  - Select property from their asset list
  - Enter loan amount requested
  - Enter interest rate (or use bank's standard rate)
  - Enter loan tenure (months/years)
  - Upload required documents (income proof, property documents)
- **FR-BM-005**: Application stored on IPFS
- **FR-BM-006**: Application status: Pending, Under Review, Approved, Rejected

#### 1.3.3 Mortgage Approval
- **FR-BM-007**: Banks can review mortgage applications
- **FR-BM-008**: Banks can approve/reject applications
- **FR-BM-009**: On approval, mortgage is recorded on blockchain
- **FR-BM-010**: Property gets "Mortgaged" status
- **FR-BM-011**: Lien is placed on property (prevents sale without bank approval)

#### 1.3.4 Mortgage Management
- **FR-BM-012**: Track mortgage payments
- **FR-BM-013**: Calculate remaining balance
- **FR-BM-014**: View payment history
- **FR-BM-015**: Mark mortgage as "Paid Off" when complete
- **FR-BM-016**: Remove lien when mortgage is paid off
- **FR-BM-017**: Handle default cases (foreclosure process)

#### 1.3.5 Property Sale with Mortgage
- **FR-BM-018**: Property with active mortgage cannot be sold without bank approval
- **FR-BM-019**: Bank can approve property sale if:
  - Mortgage is paid off from sale proceeds, OR
  - New buyer assumes mortgage, OR
  - Bank approves transfer
- **FR-BM-020**: Mortgage transfer to new owner option

### 1.4 Data Model

**Mortgage Structure:**
```solidity
struct Mortgage {
    uint256 mortgageId;
    uint256 propertyId;
    address propertyOwner;
    address bankAddress;
    uint256 loanAmount;
    uint256 interestRate;      // in basis points (e.g., 500 = 5%)
    uint256 tenure;           // in months
    uint256 remainingBalance;
    uint256 startDate;
    uint256 nextPaymentDate;
    MortgageStatus status;
    string ipfsHash;          // Application documents
    bool lienActive;
}

enum MortgageStatus {
    Pending,
    Approved,
    Active,
    PaidOff,
    Defaulted,
    Foreclosed
}
```

**Bank Structure:**
```solidity
struct Bank {
    address bankAddress;
    string bankName;
    string licenseNumber;
    string contactInfo;
    bool isApproved;
    bool exists;
}
```

### 1.5 User Stories

**As a Property Owner:**
- I want to apply for a mortgage against my property
- I want to view my active mortgages
- I want to see payment schedule and remaining balance
- I want to make mortgage payments
- I want to sell my property even if it has a mortgage (with bank approval)

**As a Bank:**
- I want to register as an authorized bank
- I want to review mortgage applications
- I want to approve/reject mortgage applications
- I want to track all mortgages I've issued
- I want to manage mortgage payments
- I want to approve property sales with active mortgages

**As Government:**
- I want to approve bank registrations
- I want to view all mortgages in the system
- I want to monitor mortgage defaults

---

## Feature 2: Property Survey System

### 2.1 Overview

The Property Survey System enables:
- Surveyor registration and certification
- Property survey requests
- Survey report submission
- Government verification of surveys
- Survey history tracking
- Integration with property registration

### 2.2 User Roles

**New User Type: Surveyor**
- Surveyor registration with certification
- Surveyor login credentials
- Surveyor dashboard
- Survey submission interface

### 2.3 Functional Requirements

#### 2.3.1 Surveyor Registration
- **FR-PS-001**: Surveyors can register with:
  - Full Name
  - License/Certification Number
  - Contact Information
  - Specialization (Land Surveying, Boundary Survey, etc.)
  - Years of Experience
  - Ethereum Address
- **FR-PS-002**: Government must verify and approve surveyor registration
- **FR-PS-003**: Approved surveyors receive unique Surveyor ID

#### 2.3.2 Survey Request
- **FR-PS-004**: Property owners can request survey:
  - Select property
  - Specify survey type (Boundary, Topographic, Construction, etc.)
  - Enter property description
  - Upload existing documents (if any)
- **FR-PS-005**: Government can also request surveys for verification
- **FR-PS-006**: Survey request status: Pending, Assigned, In Progress, Completed

#### 2.3.3 Survey Assignment
- **FR-PS-007**: Government assigns survey requests to approved surveyors
- **FR-PS-008**: Surveyors can view assigned surveys
- **FR-PS-009**: Surveyors can accept/reject assignments

#### 2.3.4 Survey Conducting
- **FR-PS-010**: Surveyors conduct on-site survey
- **FR-PS-011**: Surveyors record:
  - Survey Date
  - Survey Type
  - Property Boundaries (coordinates)
  - Property Dimensions
  - Landmarks
  - Encroachments (if any)
  - Survey Notes
  - GPS Coordinates
  - Survey Images/Photos

#### 2.3.5 Survey Report Submission
- **FR-PS-012**: Surveyors upload survey report:
  - Survey Report PDF
  - Survey Maps/Plots
  - Boundary Markers Photos
  - GPS Data
  - Surveyor's Digital Signature
- **FR-PS-013**: Report stored on IPFS
- **FR-PS-014**: Survey status changes to "Submitted for Verification"

#### 2.3.6 Survey Verification
- **FR-PS-015**: Government reviews survey reports
- **FR-PS-016**: Government can:
  - Approve survey
  - Request revisions
  - Reject survey (with reason)
- **FR-PS-017**: Approved surveys are linked to property
- **FR-PS-018**: Survey becomes part of property's permanent record

#### 2.3.7 Survey History
- **FR-PS-019**: View all surveys conducted for a property
- **FR-PS-020**: Track survey history and changes
- **FR-PS-021**: Compare multiple surveys (if property resurveyed)

### 2.4 Data Model

**Survey Structure:**
```solidity
struct Survey {
    uint256 surveyId;
    uint256 propertyId;
    address propertyOwner;
    address surveyorAddress;
    address requestedBy;      // Owner or Government
    string surveyType;        // Boundary, Topographic, etc.
    string ipfsHash;          // Survey report
    string gpsCoordinates;
    uint256 surveyDate;
    uint256 submissionDate;
    SurveyStatus status;
    string remarks;
}

enum SurveyStatus {
    Pending,
    Assigned,
    InProgress,
    Submitted,
    Approved,
    RevisionRequested,
    Rejected
}
```

**Surveyor Structure:**
```solidity
struct Surveyor {
    address surveyorAddress;
    string name;
    string licenseNumber;
    string specialization;
    uint256 experienceYears;
    bool isApproved;
    bool exists;
}
```

### 2.5 User Stories

**As a Property Owner:**
- I want to request a survey for my property
- I want to view survey status
- I want to download approved survey reports
- I want to see survey history for my property

**As a Surveyor:**
- I want to register as a certified surveyor
- I want to view assigned surveys
- I want to submit survey reports
- I want to track my survey history
- I want to view payment status (if applicable)

**As Government:**
- I want to approve surveyor registrations
- I want to assign surveys to surveyors
- I want to verify survey reports
- I want to view all surveys in the system
- I want to request resurveys if needed

---

## Technical Architecture

### 3.1 Smart Contract Extensions

**New Contract: `LandRegistryExtended.sol`**

```solidity
pragma solidity ^0.5.0;

import "./LandRegistry.sol";

contract LandRegistryExtended {
    LandRegistry public landRegistry;
    
    // Mortgage mappings
    mapping(uint256 => Mortgage) public mortgages;
    mapping(address => uint256[]) public bankMortgages;
    mapping(uint256 => uint256) public propertyMortgage; // propertyId => mortgageId
    
    // Survey mappings
    mapping(uint256 => Survey) public surveys;
    mapping(uint256 => uint256[]) public propertySurveys; // propertyId => surveyIds[]
    mapping(address => uint256[]) public surveyorSurveys;
    
    // Bank and Surveyor mappings
    mapping(address => Bank) public banks;
    mapping(address => Surveyor) public surveyors;
    
    address public governmentAddress;
    
    // Events
    event MortgageCreated(uint256 mortgageId, uint256 propertyId, address bank);
    event MortgagePaidOff(uint256 mortgageId);
    event SurveySubmitted(uint256 surveyId, uint256 propertyId);
    event SurveyApproved(uint256 surveyId);
}
```

### 3.2 Frontend Components

**New Components:**
1. `Bank_Register.js` - Bank registration form
2. `Bank_Login.js` - Bank login page
3. `Bank_Dashboard.js` - Bank dashboard
4. `Mortgage_Application.js` - Mortgage application form
5. `Mortgage_Management.js` - Mortgage management interface
6. `Surveyor_Register.js` - Surveyor registration
7. `Surveyor_Login.js` - Surveyor login
8. `Surveyor_Dashboard.js` - Surveyor dashboard
9. `Survey_Request.js` - Survey request form
10. `Survey_Submission.js` - Survey report submission
11. `Survey_Viewer.js` - View survey reports

**Updated Components:**
- `Dashboard.js` - Add mortgage and survey tabs
- `Dashboard_Govt.js` - Add bank/surveyor approval, survey assignment
- `Owner_Table.js` - Show mortgage status
- `RegistrationForm.js` - Link to survey request

### 3.3 Backend Extensions

**New Models:**
1. `Bank.js` - Bank schema
2. `Surveyor.js` - Surveyor schema
3. `Mortgage.js` - Mortgage schema
4. `Survey.js` - Survey schema

**New Controllers:**
1. `bankController.js` - Bank registration, login, mortgage management
2. `surveyorController.js` - Surveyor registration, login, survey management
3. `mortgageController.js` - Mortgage CRUD operations
4. `surveyController.js` - Survey CRUD operations

**New API Routes:**
- `/api/bank/register`
- `/api/bank/login`
- `/api/bank/mortgage/create`
- `/api/bank/mortgage/list`
- `/api/surveyor/register`
- `/api/surveyor/login`
- `/api/surveyor/survey/submit`
- `/api/surveyor/survey/list`
- `/api/survey/request`
- `/api/survey/verify`

---

## Database Schema

### 4.1 MongoDB Collections

**Bank Collection:**
```javascript
{
  bankName: String,
  bankAddress: String,
  contact: String,
  licenseNumber: String,
  ethereumAddress: String,
  isApproved: Boolean,
  approvedBy: String, // Government user
  approvedDate: Date,
  createdAt: Date
}
```

**Surveyor Collection:**
```javascript
{
  name: String,
  licenseNumber: String,
  contact: String,
  email: String,
  specialization: String,
  experienceYears: Number,
  ethereumAddress: String,
  isApproved: Boolean,
  approvedBy: String,
  approvedDate: Date,
  createdAt: Date
}
```

**Mortgage Collection:**
```javascript
{
  mortgageId: Number, // From blockchain
  propertyId: Number,
  propertyOwner: String, // Ethereum address
  bankAddress: String,
  loanAmount: Number,
  interestRate: Number,
  tenure: Number, // months
  remainingBalance: Number,
  startDate: Date,
  nextPaymentDate: Date,
  status: String, // Pending, Approved, Active, PaidOff, Defaulted
  ipfsHash: String,
  lienActive: Boolean,
  payments: [{
    amount: Number,
    date: Date,
    transactionHash: String
  }],
  createdAt: Date
}
```

**Survey Collection:**
```javascript
{
  surveyId: Number, // From blockchain
  propertyId: Number,
  propertyOwner: String,
  surveyorAddress: String,
  requestedBy: String, // Owner or Government
  surveyType: String, // Boundary, Topographic, etc.
  ipfsHash: String, // Survey report
  gpsCoordinates: String,
  surveyDate: Date,
  submissionDate: Date,
  status: String, // Pending, Assigned, InProgress, Submitted, Approved
  remarks: String,
  assignedBy: String, // Government user
  verifiedBy: String, // Government user
  verifiedDate: Date,
  createdAt: Date
}
```

---

## Smart Contract Changes

### 5.1 New Functions

**Mortgage Functions:**
```solidity
function registerBank(string memory bankName, string memory licenseNumber) public;
function approveBank(address bankAddress) public; // Only government
function applyForMortgage(uint256 propertyId, uint256 loanAmount, uint256 interestRate, uint256 tenure) public;
function approveMortgage(uint256 mortgageId) public; // Only bank
function makePayment(uint256 mortgageId, uint256 amount) public payable;
function markMortgagePaidOff(uint256 mortgageId) public; // Bank or owner
function approvePropertySaleWithMortgage(uint256 propertyId, uint256 mortgageId) public; // Bank
```

**Survey Functions:**
```solidity
function registerSurveyor(string memory name, string memory licenseNumber, string memory specialization) public;
function approveSurveyor(address surveyorAddress) public; // Only government
function requestSurvey(uint256 propertyId, string memory surveyType) public;
function assignSurvey(uint256 surveyId, address surveyorAddress) public; // Only government
function submitSurvey(uint256 surveyId, string memory ipfsHash, string memory gpsCoordinates) public; // Only surveyor
function verifySurvey(uint256 surveyId, bool approved, string memory remarks) public; // Only government
function getPropertySurveys(uint256 propertyId) public view returns (uint256[] memory);
```

### 5.2 Modified Functions

**Update `buyProperty()` function:**
- Check if property has active mortgage
- Require bank approval if mortgage exists
- Transfer mortgage to new owner or pay off from sale proceeds

**Update `landDetails` struct:**
- Add `mortgageId` field
- Add `hasActiveMortgage` boolean
- Add `lastSurveyId` field

---

## API Endpoints

### 6.1 Bank Endpoints

```
POST   /api/bank/register              - Register new bank
POST   /api/bank/login                 - Bank login
GET    /api/bank/profile               - Get bank profile
GET    /api/bank/mortgages             - List all mortgages
POST   /api/bank/mortgage/create       - Create mortgage application
PUT    /api/bank/mortgage/:id/approve  - Approve mortgage
PUT    /api/bank/mortgage/:id/reject   - Reject mortgage
GET    /api/bank/mortgage/:id          - Get mortgage details
POST   /api/bank/mortgage/:id/payment  - Record payment
PUT    /api/bank/mortgage/:id/paidoff  - Mark as paid off
POST   /api/bank/property/:id/approve-sale - Approve property sale with mortgage
```

### 6.2 Surveyor Endpoints

```
POST   /api/surveyor/register          - Register new surveyor
POST   /api/surveyor/login             - Surveyor login
GET    /api/surveyor/profile           - Get surveyor profile
GET    /api/surveyor/surveys           - List assigned surveys
GET    /api/surveyor/survey/:id        - Get survey details
POST   /api/surveyor/survey/:id/submit - Submit survey report
PUT    /api/surveyor/survey/:id/accept - Accept survey assignment
PUT    /api/surveyor/survey/:id/reject - Reject survey assignment
```

### 6.3 Survey Endpoints

```
POST   /api/survey/request             - Request survey (owner or government)
GET    /api/survey/list                - List all surveys
GET    /api/survey/property/:id        - Get surveys for property
POST   /api/survey/:id/assign          - Assign survey to surveyor (government)
PUT    /api/survey/:id/verify          - Verify survey (government)
GET    /api/survey/:id                 - Get survey details
GET    /api/survey/:id/report          - Download survey report
```

### 6.4 Mortgage Endpoints (User)

```
POST   /api/mortgage/apply             - Apply for mortgage
GET    /api/mortgage/my-mortgages      - Get user's mortgages
GET    /api/mortgage/property/:id      - Get mortgage for property
POST   /api/mortgage/:id/payment       - Make payment
GET    /api/mortgage/:id/history       - Get payment history
```

---

## User Interface Design

### 7.1 Bank Dashboard

**Tabs:**
1. **Overview** - Statistics (Total Mortgages, Active, Paid Off, Defaulted)
2. **Applications** - Pending mortgage applications
3. **Active Mortgages** - Currently active mortgages
4. **Payment History** - All payment records
5. **Settings** - Bank profile and settings

**Key UI Elements:**
- Mortgage application review cards
- Mortgage status badges (Active, Paid Off, Defaulted)
- Payment schedule calendar
- Remaining balance indicators
- Property sale approval requests

### 7.2 Surveyor Dashboard

**Tabs:**
1. **Assigned Surveys** - Surveys assigned to surveyor
2. **In Progress** - Surveys being conducted
3. **Submitted** - Surveys submitted for verification
4. **Completed** - Approved surveys
5. **Profile** - Surveyor profile and statistics

**Key UI Elements:**
- Survey assignment cards
- Survey submission form with file upload
- GPS coordinate input
- Survey type selector
- Status tracking timeline

### 7.3 Government Dashboard Updates

**New Sections:**
1. **Bank Management** - Approve/reject bank registrations
2. **Surveyor Management** - Approve/reject surveyor registrations
3. **Survey Assignment** - Assign surveys to surveyors
4. **Survey Verification** - Review and approve survey reports
5. **Mortgage Overview** - View all mortgages in system

### 7.4 User Dashboard Updates

**New Tabs:**
1. **My Mortgages** - View active mortgages, payment schedule
2. **Apply for Mortgage** - Mortgage application form
3. **Request Survey** - Survey request form
4. **Survey Reports** - View approved survey reports

**Updated Property Cards:**
- Show mortgage status badge
- Show survey status badge
- Link to mortgage details
- Link to survey reports

---

## Workflow Diagrams

### 8.1 Mortgage Workflow

```
[Property Owner] → Apply for Mortgage
       ↓
[Upload Documents] → Store on IPFS
       ↓
[Bank Reviews] → Approve/Reject
       ↓
[If Approved] → Mortgage Created on Blockchain
       ↓
[Lien Placed] → Property Status: "Mortgaged"
       ↓
[Owner Makes Payments] → Update Remaining Balance
       ↓
[When Paid Off] → Remove Lien, Status: "Paid Off"
```

### 8.2 Survey Workflow

```
[Owner/Government] → Request Survey
       ↓
[Government] → Assign to Surveyor
       ↓
[Surveyor] → Accept Assignment
       ↓
[Surveyor] → Conduct On-Site Survey
       ↓
[Surveyor] → Submit Report (IPFS)
       ↓
[Government] → Verify Survey
       ↓
[If Approved] → Link to Property, Status: "Approved"
```

### 8.3 Property Sale with Mortgage

```
[Owner] → Request to Sell Property
       ↓
[System Checks] → Has Active Mortgage?
       ↓
[Yes] → Request Bank Approval
       ↓
[Bank Reviews] → Options:
   1. Pay off from sale proceeds
   2. Transfer mortgage to buyer
   3. Reject sale
       ↓
[If Approved] → Proceed with Sale
       ↓
[Update Mortgage] → Transfer or Close
```

---

## Security Considerations

### 9.1 Access Control

- **Bank Registration**: Only government can approve
- **Surveyor Registration**: Only government can approve
- **Mortgage Approval**: Only bank can approve their own applications
- **Survey Assignment**: Only government can assign
- **Survey Verification**: Only government can verify
- **Property Sale with Mortgage**: Requires bank approval

### 9.2 Data Integrity

- All mortgage transactions recorded on blockchain
- Survey reports stored on IPFS (immutable)
- Payment history tracked on blockchain
- Lien status verified on-chain before property sale

### 9.3 Smart Contract Security

- Use `require()` statements for all validations
- Implement access modifiers (onlyOwner, onlyBank, onlyGovernment)
- Prevent reentrancy attacks
- Validate all inputs
- Use SafeMath for arithmetic operations

### 9.4 Frontend Security

- JWT authentication for bank and surveyor
- Role-based route protection
- Input validation and sanitization
- Secure file uploads (IPFS)
- MetaMask transaction signing

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Design database schemas
- [ ] Create MongoDB models (Bank, Surveyor, Mortgage, Survey)
- [ ] Update smart contract with new structs
- [ ] Create backend API routes structure
- [ ] Set up authentication for new user types

### Phase 2: Bank Mortgage System (Week 3-4)
- [ ] Implement bank registration and approval
- [ ] Create mortgage application system
- [ ] Implement mortgage approval workflow
- [ ] Add lien management to smart contract
- [ ] Create bank dashboard UI
- [ ] Implement payment tracking
- [ ] Add property sale with mortgage approval

### Phase 3: Survey System (Week 5-6)
- [ ] Implement surveyor registration and approval
- [ ] Create survey request system
- [ ] Implement survey assignment workflow
- [ ] Create survey submission interface
- [ ] Add survey verification system
- [ ] Create surveyor dashboard UI
- [ ] Implement survey report viewer

### Phase 4: Integration & Testing (Week 7-8)
- [ ] Integrate mortgage status in property views
- [ ] Integrate survey reports in property details
- [ ] Update government dashboard
- [ ] Update user dashboard with new features
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation

### Phase 5: Deployment (Week 9)
- [ ] Deploy updated smart contracts
- [ ] Update frontend and backend
- [ ] Migrate existing data
- [ ] User training and documentation
- [ ] Go-live

---

## Success Metrics

### Mortgage System
- Number of banks registered
- Number of mortgage applications
- Average mortgage processing time
- Mortgage default rate
- User satisfaction with mortgage process

### Survey System
- Number of surveyors registered
- Number of surveys conducted
- Average survey completion time
- Survey approval rate
- Survey accuracy (government feedback)

---

## Future Enhancements

1. **Automated Mortgage Payments**: Smart contract-based automatic payments
2. **Mortgage Insurance**: Integration with insurance providers
3. **Survey Scheduling**: Calendar-based survey appointment system
4. **Survey Comparison Tool**: Compare multiple surveys for same property
5. **Mobile App**: Mobile applications for surveyors
6. **Blockchain-based Survey Verification**: Store survey data on-chain
7. **Mortgage Marketplace**: Secondary market for mortgages
8. **AI-Powered Survey Analysis**: Automated survey report analysis

---

## Conclusion

The Bank Mortgage and Survey features will significantly enhance the Land Registry Application by:
- Enabling property financing through blockchain-secured mortgages
- Providing professional property surveying capabilities
- Maintaining complete audit trail of all transactions
- Ensuring transparency and immutability
- Streamlining government verification processes

These features align with real-world land registry requirements and add substantial value to the blockchain-based system.

---

**Document Status:** Draft for Review  
**Next Steps:** Technical review, stakeholder approval, implementation planning

