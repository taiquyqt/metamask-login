import React, { useState } from 'react';
import Web3 from 'web3';
import avatar from './avatar.png';

const App = () => {
  const [account, setAccount] = useState('');
  const [walletName, setWalletName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [balance, setBalance] = useState('0');

  const web3 = new Web3(window.ethereum);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        setAccount(address);
        checkWalletName(address);
        getBalance(address);
        setIsConnected(true);
      } catch (error) {
        console.error("Lỗi khi kết nối MetaMask:", error);
        alert("Đã xảy ra lỗi khi kết nối MetaMask. Vui lòng thử lại.");
      }
    } else {
      alert('Vui lòng cài đặt MetaMask để sử dụng ứng dụng này.');
    }
  };

  const getBalance = async (address) => {
    const weiBalance = await web3.eth.getBalance(address);
    const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
    setBalance(parseFloat(ethBalance).toFixed(4));
  };

  const checkWalletName = (address) => {
    const savedName = localStorage.getItem(`walletName_${address}`);
    if (savedName) {
      setWalletName(savedName);
    } else {
      const enteredName = prompt("Nhập tên của bạn:");
      if (enteredName) {
        localStorage.setItem(`walletName_${address}`, enteredName);
        setWalletName(enteredName);
      }
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setNewName(walletName);
  };

  const handleSaveName = () => {
    if (newName.trim() !== '') {
      localStorage.setItem(`walletName_${account}`, newName);
      setWalletName(newName);
    }
    setIsEditingName(false);
  };

  const handleLogout = () => {
    setIsConnected(false);
    setAccount('');
    setWalletName('');
    setBalance('0');
  };

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {!isConnected ? (
        <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <h1>Login</h1>
          <button
            onClick={connectMetaMask}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              width: '100%',
              marginTop: '20px',
            }}
          >
            Login with MetaMask
          </button>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}>
          <img src={avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
          {isEditingName ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSaveName}
              autoFocus
              style={{ fontSize: '16px', fontWeight: 'bold', border: 'none', outline: 'none', background: 'transparent' }}
            />
          ) : (
            <p onDoubleClick={handleEditName} style={{ fontSize: '16px', fontWeight: 'bold' }}>
              <strong>{walletName}</strong>
            </p>
          )}

          {showTooltip && (
            <div style={{ position: 'absolute', top: '50px', right: '0', backgroundColor: '#333', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '14px', whiteSpace: 'nowrap', textAlign: 'left', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
              <p style={{ margin: 0 }}>📌 Địa chỉ ví: {account.slice(0, 6)}...{account.slice(-4)}</p>
              <p style={{ margin: 0 }}>💰 Số dư: {balance} ETH</p>
              <button onClick={handleLogout} style={{ marginTop: '5px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Đăng xuất</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
