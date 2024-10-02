import React, { useState, useEffect } from 'react';
import { healthcareContract, web3 } from './web.js'; // Import the updated web3 instance
import './App.css';
import './styles.css';
import Notification from './Notification';

function App() {
  const [accountBalance, setAccountBalance] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);

        const balance = await healthcareContract.methods.balances(accounts[0]).call();
        setAccountBalance(web3.utils.fromWei(balance, 'ether'));

        window.ethereum.on('accountsChanged', async (accounts) => {
          setCurrentAccount(accounts[0]);
          const balance = await healthcareContract.methods.balances(accounts[0]).call();
          setAccountBalance(web3.utils.fromWei(balance, 'ether'));
        });

        window.ethereum.on('chainChanged', async () => {
          // Handle network change if needed
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setCurrentAccount(accounts[0]);
          const balance = await healthcareContract.methods.balances(accounts[0]).call();
          setAccountBalance(web3.utils.fromWei(balance, 'ether'));
        });
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    initializeWeb3();
  }, []);

  const updateBalance = async () => {
    if (web3 && currentAccount) {
      try {
        const balance = await healthcareContract.methods.balances(currentAccount).call();
        setAccountBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const handleDeposit = async () => {
    if (depositAmount > 0 && web3 && currentAccount) {
      try {
        const amountToDeposit = web3.utils.toWei(depositAmount, 'ether');
        await healthcareContract.methods.deposit().send({ from: currentAccount, value: amountToDeposit });
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
    if (withdrawAmount > 0 && web3 && currentAccount) {
      try {
        const amountToWithdraw = web3.utils.toWei(withdrawAmount, 'ether');
        await healthcareContract.methods.withdraw(amountToWithdraw).send({ from: currentAccount });
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
    if (paymentAmount > 0 && clinicAddress && web3 && currentAccount) {
      try {
        const amountToPay = web3.utils.toWei(paymentAmount, 'ether');
        await healthcareContract.methods.payForHealthcare(clinicAddress, amountToPay).send({ from: currentAccount });
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
    if (web3 && currentAccount) {
      try {
        await healthcareContract.methods.claimPayment().send({ from: currentAccount });
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
            <h2>DotLife Platform</h2>
          </div>

          <div className="action-card">
            <h3>All About Your Wallet!</h3>
            <p>Your Wallet Address: {currentAccount}</p>
            <p>Your Account Balance: {accountBalance} ETH</p>
          </div>
        </section>

        <section className="right-section">
          <div className="action-card">
            <h2>Deposit</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Your Deposit Amount"
            />
            <button onClick={handleDeposit}>Deposit</button>
          </div>

          <div className="action-card">
            <h2>Withdraw</h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Your Withdrawal Amount"
            />
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>

          <div className="action-card">
            <h2>Pay for Healthcare</h2>
            <input
              type="text"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              placeholder="Clinics Near You!"
            />
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Payable Amount"
            />
            <button onClick={handlePayment}>Pay</button>
          </div>

          <div className="action-card">
            <h2>Claim Your Payment Now! </h2>
            <button onClick={handleClaimPayment}>Claim Payment</button>
          </div>
        </section>
      </main>

      {notification.show && (
        <Notification message={notification.message} onClose={() => setNotification({ show: false, message: '' })} />
      )}

      <footer className="footer">
        <p>&copy; 2024 DotLife Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
