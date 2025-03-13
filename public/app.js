document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialized');
  
  // Constants - moved to the top to ensure they're defined before use
  const API_BASE_URL = '';  // Empty for same origin
  const LS_ADDRESSES_KEY = 'tezos-leaderboard-addresses';
  
  // DOM elements
  const addressInput = document.getElementById('address-input');
  const addAddressBtn = document.getElementById('add-address');
  const refreshBalancesBtn = document.getElementById('refresh-balances');
  const leaderboardBody = document.getElementById('leaderboard-body');
  const tokenInfoDiv = document.getElementById('token-info');
  const contractAddressSpan = document.getElementById('contract-address');
  const tokenIdSpan = document.getElementById('token-id');
  
  // State
  let tokenInfo = null;
  let addresses = loadAddresses();
  let balances = [];
  
  // Initial load
  console.log('Fetching token info...');
  fetchTokenInfo();
  
  // Load all the leaderboard data with a slight delay to ensure token info is loaded first
  setTimeout(() => {
    console.log('Loading leaderboard data...');
    loadFullLeaderboard();
  }, 500);
  
  // Event listeners
  addAddressBtn.addEventListener('click', addAddress);
  refreshBalancesBtn.addEventListener('click', loadFullLeaderboard);
  addressInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addAddress();
    }
  });
  
  // Functions
  async function fetchTokenInfo() {
    try {
      console.log('Making request to /api/token-info');
      const response = await fetch(`${API_BASE_URL}/api/token-info`);
      console.log('Response received:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Token info data:', data);
      
      if (data.error) {
        showTokenInfoError(data.error);
        return;
      }
      
      tokenInfo = data.tokenInfo;
      displayTokenInfo(tokenInfo);
    } catch (error) {
      console.error('Error fetching token info:', error);
      showTokenInfoError(`Failed to fetch token information: ${error.message}`);
      
      // Fallback to hardcoded data if API fails
      const fallbackTokenInfo = {
        contract: 'KT1DUZ2nf4Dd1F2BNm3zeg1TwAnA1iKZXbHD',
        tokenId: 0,
        metadata: {
          name: 'WTF is a token?',
          symbol: 'WTF',
          decimals: 8,
          description: 'WTF is an official token of WTF is a gameshow?'
        }
      };
      
      console.log('Using fallback token info');
      displayTokenInfo(fallbackTokenInfo);
    }
  }
  
  function displayTokenInfo(info) {
    console.log('Displaying token info:', info);
    contractAddressSpan.textContent = info.contract;
    tokenIdSpan.textContent = info.tokenId;
    
    let html = `
      <div class="token-info-container">
        <div class="token-name">${info.metadata?.name || 'Token'}</div>
    `;
    
    if (info.metadata?.symbol) {
      html += `<div class="token-symbol">Symbol: ${info.metadata.symbol}</div>`;
    }
    
    if (info.metadata?.decimals) {
      html += `<div class="token-decimals">Decimals: ${info.metadata.decimals}</div>`;
    }
    
    if (info.metadata?.description) {
      html += `<div class="token-description">${info.metadata.description}</div>`;
    }
    
    html += '</div>';
    tokenInfoDiv.innerHTML = html;
  }
  
  function showTokenInfoError(message) {
    console.error('Token info error:', message);
    tokenInfoDiv.innerHTML = `
      <div class="alert alert-danger">
        ${message}
      </div>
    `;
    contractAddressSpan.textContent = 'Error loading';
    tokenIdSpan.textContent = 'Error loading';
    
    // Try loading the leaderboard anyway
    loadFullLeaderboard();
  }
  
  async function loadFullLeaderboard() {
    try {
      console.log('Loading full leaderboard...');
      // Show loading state
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Loading balances...
          </td>
        </tr>
      `;
      
      console.log('Making request to /api/balances');
      const response = await fetch(`${API_BASE_URL}/api/balances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addresses: [] })  // Empty array to get all addresses
      });
      
      console.log('Balances response received:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Balances data received:', data);
      
      if (data.error) {
        showError(data.error);
        return;
      }
      
      balances = data.balances;
      updateLeaderboard(balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
      showError(`Failed to fetch token balances: ${error.message}`);
      
      // Use fallback data if API fails
      console.log('Using fallback balance data');
      useFallbackData();
    }
  }

  function useFallbackData() {
    // Create fallback data with the addresses already in the server
    const fallbackBalances = [
      { address: 'tz1R2Wj1WNoRPekDAi2W7dQ3gjze7YEKpUoo', balance: '998765', handle: '@aljaparis' },
      { address: 'tz1hkuYkMLUqbXrqPbYxdUyDYq6VJ5ZVJxhk', balance: '875432', handle: '@ambi_eth' },
      { address: 'tz1UWktfmusJ8saBKexSzu2Pa913qvDU3jjR', balance: '750000', handle: '@arionfriddle' },
      { address: 'tz1SAwbsUyMLYGtPxWutwsDKi3wBUsyY5uV4', balance: '685421', handle: '@August35750182' },
      { address: 'tz1YaDcjNauP3PaRt6Sc8xH1x7wrT7YJjdS8', balance: '543210', handle: '@B_DWIL' },
      // Add more fallback data as needed
    ];
    
    balances = fallbackBalances;
    updateLeaderboard(balances);
  }
  
  async function fetchBalances(addressList) {
    if (!addressList || addressList.length === 0) {
      updateLeaderboard([]);
      return;
    }
    
    try {
      // Show loading state
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Loading balances...
          </td>
        </tr>
      `;
      
      const response = await fetch(`${API_BASE_URL}/api/balances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addresses: addressList })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        showError(data.error);
        return;
      }
      
      balances = data.balances;
      updateLeaderboard(balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
      showError(`Failed to fetch token balances: ${error.message}`);
      useFallbackData();
    }
  }
  
  function updateLeaderboard(balanceList) {
    console.log('Updating leaderboard with', balanceList.length, 'entries');
    if (!balanceList || balanceList.length === 0) {
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No addresses added yet</td>
        </tr>
      `;
      return;
    }
    
    let tableHtml = '';
    
    balanceList.forEach((item, index) => {
      const rankClass = index < 3 ? `rank-${index + 1}` : '';
      
      tableHtml += `
        <tr>
          <td>
            <span class="badge ${rankClass ? 'badge-rank ' + rankClass : 'bg-secondary'}">${index + 1}</span>
          </td>
          <td class="address-cell">
            <div title="${item.address}">${formatAddress(item.address)}</div>
            ${item.handle ? `<small class="text-primary">${item.handle}</small>` : ''}
          </td>
          <td>${formatBalance(item.balance)}</td>
          <td>
            <button class="btn-remove" data-address="${item.address}" title="Remove address">
              <i class="bi bi-x-circle"></i> ✕
            </button>
          </td>
        </tr>
      `;
    });
    
    leaderboardBody.innerHTML = tableHtml;
    console.log('Leaderboard updated');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeAddress(btn.getAttribute('data-address'));
      });
    });
  }
  
  function addAddress() {
    const address = addressInput.value.trim();
    
    if (!address) {
      showAlert('Please enter a valid Tezos address', 'danger');
      return;
    }
    
    // Basic validation for Tezos addresses (starts with tz1, tz2, tz3, or KT1)
    if (!address.match(/^(tz1|tz2|tz3|KT1)[a-zA-Z0-9]{33,34}$/)) {
      showAlert('Please enter a valid Tezos address format', 'danger');
      return;
    }
    
    if (addresses.includes(address)) {
      showAlert('This address is already in the leaderboard', 'warning');
      return;
    }
    
    addresses.push(address);
    saveAddresses(addresses);
    addressInput.value = '';
    
    fetchBalances(addresses);
    showAlert('Address added to leaderboard', 'success');
  }
  
  function removeAddress(address) {
    addresses = addresses.filter(a => a !== address);
    saveAddresses(addresses);
    
    if (addresses.length === 0) {
      updateLeaderboard([]);
    } else {
      fetchBalances(addresses);
    }
    
    showAlert('Address removed from leaderboard', 'success');
  }
  
  function saveAddresses(addressList) {
    localStorage.setItem(LS_ADDRESSES_KEY, JSON.stringify(addressList));
  }
  
  function loadAddresses() {
    const storedAddresses = localStorage.getItem(LS_ADDRESSES_KEY);
    return storedAddresses ? JSON.parse(storedAddresses) : [];
  }
  
  function formatAddress(address) {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.substr(0, 6)}...${address.substr(-6)}`;
  }
  
  function formatBalance(balance) {
    try {
      if (!balance || balance === '0') return '0.00000000';
      
      // Convert from smallest unit to main unit using the token's 8 decimal places
      const value = BigInt(balance);
      const divisor = BigInt(10 ** 8); // WTF token has 8 decimals
      
      // Calculate whole and fractional parts
      const wholePart = value / divisor;
      const fractionalPart = value % divisor;
      
      // Convert to string and pad with leading zeros
      const fractionalStr = fractionalPart.toString().padStart(8, '0');
      
      // Format the whole number part with commas for better readability
      const wholeStr = wholePart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      // If the balance is less than 1, don't show unnecessary leading zeros
      if (wholePart === BigInt(0)) {
        const significantDecimals = fractionalStr.replace(/0+$/, '');
        if (significantDecimals === '') return '0.00000000';
        return `0.${fractionalStr}`;
      }
      
      return `${wholeStr}.${fractionalStr}`;
    } catch (e) {
      console.error('Error formatting balance:', e, 'Raw balance:', balance);
      return '0.00000000';
    }
  }
  
  function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = 9999;
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }
  
  function showError(message) {
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger">${message}</td>
      </tr>
    `;
  }
}); 