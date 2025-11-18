# Land Registry Application using Ethereum Blockchain

## Abstract

Developed a decentralized application using Blockchain which could overcome the short-comings of the existing process of land registry. Through Blockchain, it is possible to keep track of how property changes hand to hand. For buyers, sellers and Government registrars, it is easier to transfer the land ownership from a seller to a new buyer without any intermediaries. It provides immutability, auditability, traceability, and anonymity features which attracts the people around the globe to implement its decentralization feature in the land registry process. It also accelerates the process of registration and provides transparency to the system.

## Technologies Used

- **Frontend:** ReactJS, Styled Components, Framer Motion, React Icons
- **Backend:** NodeJS, Express
- **Database:** MongoDB
- **Blockchain:** Solidity, Web3.js, Truffle Framework
- **Storage:** IPFS (InterPlanetary File System)
- **Blockchain Network:** Ganache (Local Ethereum Blockchain)
- **Wallet:** MetaMask Browser Extension

## Prerequisites

### 1. Install Node.js (v14 or higher recommended)
- Download from: https://nodejs.org/en/
- Verify installation: `node --version` and `npm --version`
- **Note:** For Node.js v17+, you may need to use `--openssl-legacy-provider` flag (already configured in package.json)

### 1.5. Install Python 3.6+ (Required for Native Modules)
- **Why?** Some npm packages (like `bufferutil`) are native modules that need Python to compile
- Download from: https://www.python.org/downloads/
- **IMPORTANT:** During installation, check ✅ **"Add Python to PATH"**
- Verify: `python --version`
- **Windows Users:** Also install Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```
  (Run PowerShell as Administrator)
- **Troubleshooting:** See `INSTALLATION_TROUBLESHOOTING.md` for detailed solutions

### 2. Install Ganache (Local Blockchain)
- Download from: https://www.trufflesuite.com/ganache
- Choose **Ganache GUI** (recommended for beginners)
- This creates a local Ethereum blockchain for development

### 3. Install Truffle Framework
```bash
npm install -g truffle
```
- Verify: `truffle --version`

### 4. Install MetaMask Browser Extension
- Chrome: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
- Create a new wallet or import an existing one
- **Important:** This will be used to interact with the blockchain

### 5. Install MongoDB
- **Option A:** MongoDB Atlas (Cloud - Free tier available)
  - Sign up at: https://www.mongodb.com/cloud/atlas
  - Create a free cluster
  - Get connection string
  
- **Option B:** MongoDB Community Edition (Local)
  - Download from: https://www.mongodb.com/try/download/community
  - Install and start MongoDB service
  - Default connection: `mongodb://localhost:27017/land_registry`

### 6. Install IPFS (For Document Storage)
- Download from: https://dist.ipfs.tech/#go-ipfs
- Extract and add to PATH
- See `IPFS_SETUP.md` for detailed setup instructions

### 7. (Optional) Create Accounts for Notifications
- **Vonage (Nexmo)** for SMS: https://dashboard.nexmo.com/sign-up
- **Email Service** for Email notifications (Gmail SMTP or similar)

## Project Setup - Step by Step Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/1209simran/Land-Registry-Application.git
cd Land-Registry-Application
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```
This installs all React dependencies including:
- react, react-dom, react-router-dom
- web3, styled-components, framer-motion
- react-icons, axios, and more

### Step 3: Install Backend Dependencies
```bash
cd Server
npm install
cd ..
```

### Step 4: Configure MongoDB Connection
1. Navigate to: `Server/backend/Config/db_config.js`
2. Update the MongoDB connection string:
   ```javascript
   MongoURI: "mongodb://localhost:27017/land_registry"
   // OR for MongoDB Atlas:
   // MongoURI: "mongodb+srv://username:password@cluster.mongodb.net/land_registry"
   ```
3. (Optional) Configure email and SMS credentials if you want notifications

### Step 5: Start Ganache (Local Blockchain)
1. Open Ganache GUI
2. Click "New Workspace" or use "Quickstart"
3. **Important Settings:**
   - **RPC Server:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337` (or note the Chain ID shown)
   - **Network ID:** Usually `5777` (but Chain ID is `1337`)
4. Keep Ganache running throughout development

### Step 6: Configure MetaMask
1. Open MetaMask extension
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter:
   - **Network Name:** `Ganache Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
4. Click "Save"
5. **Import Account from Ganache:**
   - In Ganache, click the key icon next to any account
   - Copy the private key
   - In MetaMask: Menu → Import Account → Paste private key
   - This account will have 100 ETH for testing

### Step 7: Deploy Smart Contracts
```bash
# Compile the contracts
truffle compile

# Deploy to Ganache
truffle migrate --reset
```
**Note:** After deployment, note the contract addresses. They should be automatically saved in `src/abis/LandRegistry.json`

### Step 8: Start IPFS Daemon
```bash
# Navigate to IPFS installation directory
cd path/to/ipfs

# Initialize (first time only)
ipfs init

# Configure CORS (first time only)
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:3000"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

# Start IPFS daemon
ipfs daemon
```
**Keep this terminal open!** IPFS must be running for document uploads to work.

**Alternative:** Use the batch file if on Windows:
- Navigate to `kubo` folder
- Double-click `start-ipfs.bat`

### Step 9: Start Backend Server
```bash
# From project root
cd Server
npm start
```
The server should start on `http://localhost:3001`

### Step 10: Register Government Account
Open a new terminal and run:
```bash
curl -X POST http://localhost:3001/register_govt
```
**Government Login Credentials:**
- **Username:** `Karnataka Government`
- **Password:** `Karnataka`

### Step 11: Start Frontend Application
```bash
# From project root (in a new terminal)
npm start
```
The application should open at `http://localhost:3000`

## Complete Workflow - Detailed Guide

### Phase 1: User Registration

1. **Navigate to Registration Page**
   - Go to: `http://localhost:3000/signup`
   - Or click "Sign Up" from the home page

2. **Connect MetaMask**
   - The page will prompt you to connect MetaMask
   - Click "Connect" and approve the connection
   - Your Ethereum address will be auto-filled

3. **Fill Registration Form**
   - **Personal Information:**
     - Full Name
     - Email Address
     - Contact Number
     - Residential Address
     - City
     - Postal Code
   - **Property Details** (if registering property):
     - Property Address
     - State
     - City
     - Postal Code
     - Land Area
     - Total Amount
     - Upload Documents (PDF/Images)
     - Upload Property Images

4. **Submit Registration**
   - Click "Create Account"
   - Confirm MetaMask transaction (gas fee)
   - Wait for blockchain confirmation
   - You'll be redirected to login page

5. **Login**
   - Go to: `http://localhost:3000/login`
   - Your MetaMask address is auto-filled
   - Click "Login"
   - You'll be redirected to your Dashboard

### Phase 2: Property Registration (If not done during signup)

1. **Access Registration Form**
   - From Dashboard, click "Register Land" tab
   - Fill in all property details
   - Upload required documents
   - Upload property images

2. **Submit Property Registration**
   - Click "Submit"
   - Confirm MetaMask transaction
   - Property is now pending government approval

### Phase 3: Government Verification

1. **Government Login**
   - Go to: `http://localhost:3000/govt_login`
   - Enter credentials:
     - Username: `Karnataka Government`
     - Password: `Karnataka`

2. **Access Government Dashboard**
   - View all pending property registrations
   - Each property shows:
     - Property ID
     - Owner Details
     - Property Details
     - Documents (downloadable)
     - Images

3. **Review Property**
   - Click on property to view full details
   - Download and review documents
   - Verify all information

4. **Approve or Reject**
   - **Approve:** Click "Accept" button
     - Property status changes to "GovtApproved"
     - Owner receives email and SMS notification
     - Owner can now make property available for sale
   
   - **Reject:** Click "Reject" button
     - Property status changes to "GovtRejected"
     - Owner receives notification
     - Owner must submit a new application

### Phase 4: Making Property Available

1. **Owner Dashboard**
   - Login as property owner
   - Go to "My Properties" tab
   - Find your approved property

2. **Make Available**
   - For properties with status "GovtApproved"
   - Click "Make Available" button
   - Confirm MetaMask transaction
   - Property status changes to "Available"
   - Property now appears in "Available Properties" for all users

### Phase 5: Property Purchase Process

#### Step 1: Browse Available Properties

1. **As a Buyer**
   - Login to your account
   - Go to "Available Properties" tab
   - Browse all available properties
   - View property details:
     - Property ID
     - Owner Name
     - Land Details
     - Location (State, City)
     - Price
     - Documents
     - Images

#### Step 2: Request to Buy

1. **Send Purchase Request**
   - Find desired property
   - Click "Request to Buy" button
   - Confirm MetaMask transaction
   - Owner receives notification via email/SMS
   - Property status changes to "Pending" for owner

#### Step 3: Owner Reviews Request

1. **Owner Dashboard**
   - Login as property owner
   - Go to "My Properties" tab
   - Properties with requests show "View Request" button

2. **View Requester Details**
   - Click "View Request"
   - See buyer's information:
     - Name
     - Contact
     - Email
     - Address

3. **Accept or Reject Request**
   - **Accept:** Click "Accept" button
     - Property status changes to "Approved"
     - Buyer receives notification
     - Buyer can now purchase the property
   
   - **Reject:** Click "Reject" button
     - Property status returns to "Available"
     - Buyer receives notification
     - Property is available for other buyers

#### Step 4: Complete Purchase

1. **Buyer Dashboard**
   - Login as buyer
   - Go to "Available Properties" tab
   - Find property with "Approved" status
   - Click "Buy Now" button

2. **Payment**
   - Enter amount (must match property price)
   - Confirm MetaMask transaction
   - Payment is transferred from buyer to seller
   - Transaction is recorded on blockchain

3. **Ownership Transfer**
   - Property ownership transfers to buyer
   - Property removed from seller's asset list
   - Property added to buyer's asset list
   - Property status resets to "Not Approved" (new owner must get government approval again)

## Key Features

### 1. Decentralized Storage (IPFS)
- All documents and images are stored on IPFS
- Immutable and permanent storage
- No single point of failure
- Documents are accessible via IPFS hash

### 2. Blockchain Immutability
- All transactions recorded on blockchain
- Cannot be altered or deleted
- Complete transaction history
- Transparent and auditable

### 3. Smart Contracts
- Automated property transfer
- Secure payment processing
- Ownership management
- Request handling

### 4. Notifications
- Email notifications for:
  - Government approval/rejection
  - Purchase requests
  - Request acceptance/rejection
  - Successful transactions
- SMS notifications (if configured)

### 5. Security Features
- MetaMask wallet integration
- Encrypted passwords (bcrypt)
- JWT authentication for government
- Blockchain-based ownership verification

## Project Structure

```
Land-Registry-Application/
├── src/
│   ├── Components/          # React components
│   │   ├── Dashboard.js     # User dashboard
│   │   ├── Dashboard_Govt.js # Government dashboard
│   │   ├── Login.js         # User login
│   │   ├── Register.js      # User registration
│   │   ├── Govt_Login.js    # Government login
│   │   ├── Profile.js       # User profile
│   │   └── Help.js          # FAQ/Help page
│   ├── Containers/          # Container components
│   │   ├── Header.js        # Navigation header
│   │   ├── RegistrationForm.js # Property registration
│   │   ├── Owner_Table.js   # Owner's property table
│   │   ├── Buyer_Table.js  # Available properties table
│   │   └── Govt_Table.js    # Government review table
│   ├── abis/               # Smart contract ABIs
│   │   └── LandRegistry.json
│   ├── contracts/          # Solidity contracts
│   │   └── LandRegistry.sol
│   ├── ipfs.js             # IPFS configuration
│   └── App.js              # Main app component
├── Server/
│   └── backend/
│       ├── Controller/     # API controllers
│       ├── Model/           # MongoDB models
│       ├── Config/          # Configuration files
│       └── Api/             # External API integrations
├── migrations/              # Truffle migrations
├── kubo/                   # IPFS installation
└── package.json            # Frontend dependencies
```

## Troubleshooting

### Issue: "gyp ERR! find Python" or "Could not find Visual Studio" during npm install
**Quick Fix:**
1. Install **Visual Studio Build Tools 2022** (not just Python!):
   - Download: https://visualstudio.microsoft.com/downloads/
   - Choose "Build Tools for Visual Studio 2022"
   - Select ✅ **"Desktop development with C++"** workload
   - Install and restart computer

2. **If project is in OneDrive** (causes EPERM errors):
   - Move project outside OneDrive: `C:\Projects\Land-Registry-Application`
   - Or pause OneDrive sync during installation

3. Clean and retry:
   ```bash
   npm cache clean --force
   rmdir /s /q node_modules
   npm install
   ```

**For step-by-step guide:** See `QUICK_FIX_WINDOWS.md`  
**For detailed solutions:** See `INSTALLATION_TROUBLESHOOTING.md`

### Issue: "Token contract not deployed to detected network"
**Solution:**
1. Ensure Ganache is running
2. Check MetaMask is connected to Ganache network (Chain ID: 1337)
3. Run `truffle migrate --reset` to redeploy contracts
4. Verify contract addresses in `src/abis/LandRegistry.json`

### Issue: "IPFS connection failed" or "401 Unauthorized"
**Solution:**
1. Ensure IPFS daemon is running: `ipfs daemon`
2. Check IPFS is accessible: `http://localhost:5001/api/v0/version`
3. Verify CORS configuration
4. See `IPFS_SETUP.md` for detailed setup

### Issue: "Cannot connect to MetaMask"
**Solution:**
1. Ensure MetaMask extension is installed and unlocked
2. Check MetaMask is connected to Ganache network
3. Refresh the page and try again
4. Check browser console for errors

### Issue: "MongoDB connection failed"
**Solution:**
1. Ensure MongoDB is running (if local)
2. Check connection string in `Server/backend/Config/db_config.js`
3. Verify MongoDB Atlas credentials (if using cloud)
4. Check firewall settings

### Issue: "Properties not showing in Available Properties"
**Solution:**
1. Check property status is "Available" (not "GovtApproved")
2. Ensure you're logged in with a different account than the owner
3. Check browser console for filter logs
4. Verify IPFS is running (properties need IPFS data)

### Issue: "Transaction failed" or "Out of gas"
**Solution:**
1. Ensure you have enough ETH in MetaMask (Ganache provides 100 ETH)
2. Increase gas limit in MetaMask transaction
3. Check Ganache is running and connected

### Issue: "Government login failed"
**Solution:**
1. Ensure backend server is running
2. Run: `curl -X POST http://localhost:3001/register_govt`
3. Use correct credentials:
   - Username: `Karnataka Government`
   - Password: `Karnataka`
4. Check MongoDB for government account

## Development Notes

### Network Configuration
- **Ganache RPC:** `http://127.0.0.1:8545`
- **Chain ID:** `1337`
- **Network ID:** `5777` (but Chain ID is `1337`)

### Ports Used
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:3001`
- **Ganache RPC:** `http://localhost:8545`
- **IPFS API:** `http://localhost:5001`
- **IPFS Gateway:** `http://localhost:8080`
- **MongoDB:** `mongodb://localhost:27017`

### Environment Variables
Create a `.env` file in `Server/backend/Config/` for sensitive data:
```env
MONGO_URI=mongodb://localhost:27017/land_registry
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NEXMO_API_KEY=your_api_key
NEXMO_API_SECRET=your_api_secret
```

## Additional Resources

- **IPFS Setup Guide:** See `IPFS_SETUP.md`
- **Government Credentials Update:** See `UPDATE_GOVT_CREDENTIALS.md`
- **Truffle Documentation:** https://www.trufflesuite.com/docs
- **Web3.js Documentation:** https://web3js.readthedocs.io/
- **React Documentation:** https://reactjs.org/docs

## Security Considerations

⚠️ **Important:** This is a development/educational project. For production use:

1. **Never expose private keys**
2. **Use environment variables for sensitive data**
3. **Implement proper authentication**
4. **Add input validation**
5. **Use HTTPS in production**
6. **Implement rate limiting**
7. **Add comprehensive error handling**
8. **Use a production blockchain network (not Ganache)**
9. **Secure IPFS gateway**
10. **Implement proper access controls**

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**In case of any query, please feel free to contact the maintainers.**

**Happy Coding! 🚀**
