// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Healthcare is ERC721 {
    uint256 public nextTokenId;
    address public admin;
    uint256 public apy = 2;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastDepositTime;
    mapping(address => uint256) public clinicBalances;
    
    bool private _locked;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount, uint256 interest);
    event Payment(address indexed user, address indexed clinic, uint256 amount);
    event Claim(address indexed clinic, uint256 amount);
    event NFTMinted(address indexed to, uint256 tokenId);

    constructor() ERC721('HealthcareNFT', 'HNFT') {
        admin = msg.sender;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    function mint(address to) external {
        require(msg.sender == admin, 'only admin can mint');
        _safeMint(to, nextTokenId);
        emit NFTMinted(to, nextTokenId);
        nextTokenId++;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        lastDepositTime[msg.sender] = block.timestamp;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, 'insufficient balance');
        uint256 timeElapsed = block.timestamp - lastDepositTime[msg.sender];
        uint256 interest = balances[msg.sender] * apy * timeElapsed / 100 / 365 days;
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount + interest);
        emit Withdraw(msg.sender, amount, interest);
    }

    function payForHealthcare(address clinic, uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, 'insufficient balance');
        uint256 timeElapsed = block.timestamp - lastDepositTime[msg.sender];
        uint256 interest = balances[msg.sender] * apy * timeElapsed / 100 / 365 days;
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(interest);
        clinicBalances[clinic] += amount;
        emit Payment(msg.sender, clinic, amount);
    }

    function claimPayment() external nonReentrant {
        uint256 amount = clinicBalances[msg.sender];
        require(amount > 0, "no balance to claim");
        clinicBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Claim(msg.sender, amount);
    }

    function setApy(uint256 _apy) external {
        require(msg.sender == admin, 'only admin can set APY');
        apy = _apy;
    }
}
