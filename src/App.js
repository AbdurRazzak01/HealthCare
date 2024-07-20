import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import './styles.css';
import Notification from './Notification';
import { healthcareContract, provider } from './web.js'; // Ensure this file is correctly configured

function App() {
  const [web3, setWeb3] = useState(null);
  const [accountBalance, setAccountBalance] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Use this wallet address
  const defaultWalletAddress = '0x3016DBeE1F9580638E2691546e8D2df1535B03be';

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setWeb3(web3);
          updateBalance(); // Update balance once connected
        })
        .catch((error) => {
          console.error('Error connecting wallet:', error);
          showNotification('Error connecting wallet');
        });
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }, []);

  const updateBalance = async () => {
    if (web3) {
      try {
        const balance = await healthcareContract.methods.balances(defaultWalletAddress).call();
        setAccountBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const handleDeposit = async () => {
    if (depositAmount > 0 && web3) {
      try {
        const amountToDeposit = web3.utils.toWei(depositAmount, 'ether');
        await healthcareContract.methods.deposit().send({ from: defaultWalletAddress, value: amountToDeposit });
        setDepositAmount('');
        showNotification('Deposit Successful');
        updateBalance();
      } catch (error) {
        console.error('Error depositing:', error);
        showNotification('Error depositing');
      }
    } else {
      showNotification('Invalid deposit amount or Web3 not initialized');
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount > 0 && web3) {
      try {
        const amountToWithdraw = web3.utils.toWei(withdrawAmount, 'ether');
        await healthcareContract.methods.withdraw(amountToWithdraw).send({ from: defaultWalletAddress });
        setWithdrawAmount('');
        showNotification('Withdrawal Successful');
        updateBalance();
      } catch (error) {
        console.error('Error withdrawing:', error);
        showNotification('Error withdrawing');
      }
    } else {
      showNotification('Invalid withdraw amount or Web3 not initialized');
    }
  };

  const handlePayment = async () => {
    if (paymentAmount > 0 && clinicAddress && web3) {
      try {
        const amountToPay = web3.utils.toWei(paymentAmount, 'ether');
        await healthcareContract.methods.payForHealthcare(clinicAddress, amountToPay).send({ from: defaultWalletAddress });
        setPaymentAmount('');
        setClinicAddress('');
        showNotification('Payment Successful');
        updateBalance();
      } catch (error) {
        console.error('Error making payment:', error);
        showNotification('Error making payment');
      }
    } else {
      showNotification('Invalid payment amount, clinic address, or Web3 not initialized');
    }
  };

  const handleClaimPayment = async () => {
    if (web3) {
      try {
        await healthcareContract.methods.claimPayment().send({ from: defaultWalletAddress });
        showNotification('Claim Successful');
        updateBalance();
      } catch (error) {
        console.error('Error claiming payment:', error);
        showNotification('Error claiming payment');
      }
    } else {
      showNotification('Web3 not initialized');
    }
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="company-name">Healthcare DApp</div>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#">Learn More</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="left-section">
          <div className="action-card">
            <h2>Healthcare DApp</h2>
          </div>

          <div className="action-card">
            <h3>Account Details</h3>
            <p>Your Wallet Address: {defaultWalletAddress}</p>
            <p>Your Account Balance: {accountBalance} ETH</p>
            <button onClick={() => handleDeposit()}>Connect Wallet</button>
          </div>
        </section>

        <section className="right-section">
          <div className="action-card">
            <h2>Deposit</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount to deposit"
            />
            <button onClick={handleDeposit}>Deposit</button>
          </div>

          <div className="action-card">
            <h2>Withdraw</h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
            />
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>

          <div className="action-card">
            <h2>Pay for Healthcare</h2>
            <input
              type="text"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              placeholder="Enter clinic address"
            />
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount to pay"
            />
            <button onClick={handlePayment}>Pay</button>
          </div>

          <div className="action-card">
            <h2>Claim Payment</h2>
            <button onClick={handleClaimPayment}>Claim</button>
          </div>
        </section>
      </main>

      {notification.show && (
        <Notification message={notification.message} onClose={() => setNotification({ show: false, message: '' })} />
      )}

      <footer className="footer">
        <p>&copy; 2024 Healthcare DApp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
