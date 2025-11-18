pragma solidity ^0.5.0;

import "./LandRegistry.sol";

contract LandRegistryExtended {
    LandRegistry public landRegistry;
    
    // Enums
    enum MortgageStatus { Pending, Approved, Active, PaidOff, Defaulted, Foreclosed }
    enum SurveyStatus { Pending, Assigned, InProgress, Submitted, Approved, RevisionRequested, Rejected }
    
    // Structs
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
        string ipfsHash;
        bool lienActive;
    }
    
    struct Survey {
        uint256 surveyId;
        uint256 propertyId;
        address propertyOwner;
        address surveyorAddress;
        address requestedBy;
        string surveyType;
        string ipfsHash;
        string gpsCoordinates;
        uint256 surveyDate;
        uint256 submissionDate;
        SurveyStatus status;
        string remarks;
    }
    
    struct Bank {
        address bankAddress;
        string bankName;
        string licenseNumber;
        string contactInfo;
        bool isApproved;
        bool exists;
    }
    
    struct Surveyor {
        address surveyorAddress;
        string name;
        string licenseNumber;
        string specialization;
        uint256 experienceYears;
        bool isApproved;
        bool exists;
    }
    
    // State variables
    address public governmentAddress;
    uint256 public mortgageCounter;
    uint256 public surveyCounter;
    
    // Mappings
    mapping(uint256 => Mortgage) public mortgages;
    mapping(address => uint256[]) public bankMortgages;
    mapping(uint256 => uint256) public propertyMortgage; // propertyId => mortgageId
    mapping(uint256 => Survey) public surveys;
    mapping(uint256 => uint256[]) public propertySurveys; // propertyId => surveyIds[]
    mapping(address => uint256[]) public surveyorSurveys;
    mapping(address => Bank) public banks;
    mapping(address => Surveyor) public surveyors;
    mapping(address => bool) public isGovernment;
    
    // Events
    event BankRegistered(address indexed bankAddress, string bankName);
    event BankApproved(address indexed bankAddress);
    event MortgageCreated(uint256 indexed mortgageId, uint256 indexed propertyId, address indexed bank);
    event MortgageApproved(uint256 indexed mortgageId);
    event MortgagePaidOff(uint256 indexed mortgageId);
    event SurveyorRegistered(address indexed surveyorAddress, string name);
    event SurveyorApproved(address indexed surveyorAddress);
    event SurveyRequested(uint256 indexed surveyId, uint256 indexed propertyId);
    event SurveySubmitted(uint256 indexed surveyId);
    event SurveyApproved(uint256 indexed surveyId);
    
    // Modifiers
    modifier onlyGovernment() {
        require(isGovernment[msg.sender] || msg.sender == governmentAddress, "Only government can perform this action");
        _;
    }
    
    modifier onlyBank(address bankAddr) {
        require(banks[bankAddr].exists && banks[bankAddr].isApproved, "Bank not approved");
        require(msg.sender == bankAddr, "Only bank can perform this action");
        _;
    }
    
    modifier onlySurveyor(address surveyorAddr) {
        require(surveyors[surveyorAddr].exists && surveyors[surveyorAddr].isApproved, "Surveyor not approved");
        require(msg.sender == surveyorAddr, "Only surveyor can perform this action");
        _;
    }
    
    constructor(address _landRegistryAddress) public {
        landRegistry = LandRegistry(_landRegistryAddress);
        governmentAddress = msg.sender;
        isGovernment[msg.sender] = true;
        mortgageCounter = 0;
        surveyCounter = 0;
    }
    
    // Bank Functions
    function registerBank(string memory bankName, string memory licenseNumber, string memory contactInfo) public {
        require(!banks[msg.sender].exists, "Bank already registered");
        banks[msg.sender] = Bank({
            bankAddress: msg.sender,
            bankName: bankName,
            licenseNumber: licenseNumber,
            contactInfo: contactInfo,
            isApproved: false,
            exists: true
        });
        emit BankRegistered(msg.sender, bankName);
    }
    
    function approveBank(address bankAddress) public onlyGovernment {
        require(banks[bankAddress].exists, "Bank not registered");
        banks[bankAddress].isApproved = true;
        emit BankApproved(bankAddress);
    }
    
    // Mortgage Functions
    function applyForMortgage(
        uint256 propertyId,
        address bankAddress,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 tenure,
        string memory ipfsHash
    ) public returns (uint256) {
        require(banks[bankAddress].exists && banks[bankAddress].isApproved, "Bank not approved");
        require(propertyMortgage[propertyId] == 0, "Property already has a mortgage");
        
        mortgageCounter++;
        uint256 mortgageId = mortgageCounter;
        
        mortgages[mortgageId] = Mortgage({
            mortgageId: mortgageId,
            propertyId: propertyId,
            propertyOwner: msg.sender,
            bankAddress: bankAddress,
            loanAmount: loanAmount,
            interestRate: interestRate,
            tenure: tenure,
            remainingBalance: loanAmount,
            startDate: 0,
            nextPaymentDate: 0,
            status: MortgageStatus.Pending,
            ipfsHash: ipfsHash,
            lienActive: false
        });
        
        bankMortgages[bankAddress].push(mortgageId);
        propertyMortgage[propertyId] = mortgageId;
        
        emit MortgageCreated(mortgageId, propertyId, bankAddress);
        return mortgageId;
    }
    
    function approveMortgage(uint256 mortgageId) public onlyBank(mortgages[mortgageId].bankAddress) {
        require(mortgages[mortgageId].status == MortgageStatus.Pending, "Mortgage not pending");
        mortgages[mortgageId].status = MortgageStatus.Active;
        mortgages[mortgageId].startDate = now;
        mortgages[mortgageId].lienActive = true;
        emit MortgageApproved(mortgageId);
    }
    
    function makePayment(uint256 mortgageId) public payable {
        require(mortgages[mortgageId].status == MortgageStatus.Active, "Mortgage not active");
        require(mortgages[mortgageId].propertyOwner == msg.sender, "Only property owner can make payment");
        require(msg.value > 0, "Payment amount must be greater than 0");
        
        if (msg.value >= mortgages[mortgageId].remainingBalance) {
            mortgages[mortgageId].remainingBalance = 0;
            mortgages[mortgageId].status = MortgageStatus.PaidOff;
            mortgages[mortgageId].lienActive = false;
            propertyMortgage[mortgages[mortgageId].propertyId] = 0;
            emit MortgagePaidOff(mortgageId);
        } else {
            mortgages[mortgageId].remainingBalance -= msg.value;
        }
        
        mortgages[mortgageId].bankAddress.transfer(msg.value);
    }
    
    function markMortgagePaidOff(uint256 mortgageId) public onlyBank(mortgages[mortgageId].bankAddress) {
        mortgages[mortgageId].status = MortgageStatus.PaidOff;
        mortgages[mortgageId].lienActive = false;
        propertyMortgage[mortgages[mortgageId].propertyId] = 0;
        emit MortgagePaidOff(mortgageId);
    }
    
    function approvePropertySaleWithMortgage(uint256 propertyId, uint256 mortgageId) public onlyBank(mortgages[mortgageId].bankAddress) {
        require(mortgages[mortgageId].propertyId == propertyId, "Mortgage does not belong to this property");
        require(mortgages[mortgageId].lienActive, "No active lien on property");
        // Bank approval logic - lien can be removed or mortgage transferred
        mortgages[mortgageId].lienActive = false;
    }
    
    // Surveyor Functions
    function registerSurveyor(
        string memory name,
        string memory licenseNumber,
        string memory specialization,
        uint256 experienceYears
    ) public {
        require(!surveyors[msg.sender].exists, "Surveyor already registered");
        surveyors[msg.sender] = Surveyor({
            surveyorAddress: msg.sender,
            name: name,
            licenseNumber: licenseNumber,
            specialization: specialization,
            experienceYears: experienceYears,
            isApproved: false,
            exists: true
        });
        emit SurveyorRegistered(msg.sender, name);
    }
    
    function approveSurveyor(address surveyorAddress) public onlyGovernment {
        require(surveyors[surveyorAddress].exists, "Surveyor not registered");
        surveyors[surveyorAddress].isApproved = true;
        emit SurveyorApproved(surveyorAddress);
    }
    
    // Survey Functions
    function requestSurvey(
        uint256 propertyId,
        string memory surveyType
    ) public returns (uint256) {
        surveyCounter++;
        uint256 surveyId = surveyCounter;
        
        surveys[surveyId] = Survey({
            surveyId: surveyId,
            propertyId: propertyId,
            propertyOwner: msg.sender,
            surveyorAddress: address(0),
            requestedBy: msg.sender,
            surveyType: surveyType,
            ipfsHash: "",
            gpsCoordinates: "",
            surveyDate: 0,
            submissionDate: 0,
            status: SurveyStatus.Pending,
            remarks: ""
        });
        
        propertySurveys[propertyId].push(surveyId);
        
        emit SurveyRequested(surveyId, propertyId);
        return surveyId;
    }
    
    function assignSurvey(uint256 surveyId, address surveyorAddress) public onlyGovernment {
        require(surveys[surveyId].status == SurveyStatus.Pending, "Survey not pending");
        require(surveyors[surveyorAddress].exists && surveyors[surveyorAddress].isApproved, "Surveyor not approved");
        surveys[surveyId].surveyorAddress = surveyorAddress;
        surveys[surveyId].status = SurveyStatus.Assigned;
        surveyorSurveys[surveyorAddress].push(surveyId);
    }
    
    function submitSurvey(
        uint256 surveyId,
        string memory ipfsHash,
        string memory gpsCoordinates
    ) public onlySurveyor(surveys[surveyId].surveyorAddress) {
        require(surveys[surveyId].status == SurveyStatus.Assigned || surveys[surveyId].status == SurveyStatus.InProgress, "Survey not assigned");
        surveys[surveyId].ipfsHash = ipfsHash;
        surveys[surveyId].gpsCoordinates = gpsCoordinates;
        surveys[surveyId].surveyDate = now;
        surveys[surveyId].submissionDate = now;
        surveys[surveyId].status = SurveyStatus.Submitted;
        emit SurveySubmitted(surveyId);
    }
    
    function verifySurvey(uint256 surveyId, bool approved, string memory remarks) public onlyGovernment {
        require(surveys[surveyId].status == SurveyStatus.Submitted, "Survey not submitted");
        surveys[surveyId].remarks = remarks;
        if (approved) {
            surveys[surveyId].status = SurveyStatus.Approved;
            emit SurveyApproved(surveyId);
        } else {
            surveys[surveyId].status = SurveyStatus.Rejected;
        }
    }
    
    function getPropertySurveys(uint256 propertyId) public view returns (uint256[] memory) {
        return propertySurveys[propertyId];
    }
    
    function getPropertyMortgage(uint256 propertyId) public view returns (uint256) {
        return propertyMortgage[propertyId];
    }
    
    function setGovernmentAddress(address govAddress) public {
        require(msg.sender == governmentAddress, "Only current government can set new address");
        governmentAddress = govAddress;
        isGovernment[govAddress] = true;
    }
}

