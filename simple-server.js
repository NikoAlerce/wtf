// A simple HTTP server using Node.js built-in modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const { TezosToolkit } = require('@taquito/taquito');

const PORT = 3000;
const TEZOS_RPC = 'https://mainnet.api.tez.ie';
const WTF_TOKEN_CONTRACT = 'KT1DUZ2nf4Dd1F2BNm3zeg1TwAnA1iKZXbHD';
const WTF_TOKEN_ID = 0;

// Initialize Tezos client
const tezos = new TezosToolkit(TEZOS_RPC);

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Real addresses with X handles
// Using more realistic balances considering 8 decimal places for WTF token
const realAddresses = [
  { handle: '@aljaparis', address: 'tz1R2Wj1WNoRPekDAi2W7dQ3gjze7YEKpUoo', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@ambi_eth', address: 'tz1hkuYkMLUqbXrqPbYxdUyDYq6VJ5ZVJxhk', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@arionfriddle', address: 'tz1UWktfmusJ8saBKexSzu2Pa913qvDU3jjR', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@August35750182', address: 'tz1SAwbsUyMLYGtPxWutwsDKi3wBUsyY5uV4', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@B_DWIL', address: 'tz1YaDcjNauP3PaRt6Sc8xH1x7wrT7YJjdS8', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@pixelbetches', address: 'tz1SwJF6wV9KLFgkwUPsBpoedsse9s6gVEho', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Amossguido', address: 'tz2ArUGjG52rKA3zHSP69FH4Zhykvtz1c7Yj', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@tezosgaming', address: 'tz2NXn1uhqMbfwSJ3w2Q6ymrPQkF45BxPu9L', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@BosqueGracias', address: 'tz1Ukp188yBFu4NBgkELqqnUSXa9g1K4q1Xa', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@mat__nova', address: 'tz1Ttaq6U8M1YTHmDCrnhtm8hvFKPgj1L1yZ', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@cosmeandaluz', address: 'tz1QkNLkT3YwB1CrRSGcw7rqy5htUxDKTXRR', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@cryptocynthiac', address: 'tz1aqxbFiRRypdn7V4dtQDui1AqwSLaPmnH1', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@danielwponto02', address: 'tz1NnocCetPcTzSgj1PWJSP4nzYBx5VCkHQ1', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@desultor', address: 'tz1fB4hPBy8oQyutbmSAHAiUQcugMbrFHstu', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@dexp0nential', address: 'tz1MEc68Yubb5QWksUg9GptouxLSgUrb31iY', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@doba_jpg', address: 'tz1ephZPQDETJm3gbjUVur5tAUrKhLPLBfBN', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@darkestdollx', address: 'tz2PThfe73kzVD6VW5NyS6Ehz4arWaENqY1S', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@DopeAZMama', address: 'tz1QeLWkYZGNt7yfoSgHNiGvWmk2DKgvETtW', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@duodomusica', address: 'tz1ghkMqseGPqA6utVCeaym7gEXRsT7pw8yE', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@madeincuracao', address: 'tz1eJdkMoD2fqm5cwzrv7bNT5U1UNzWLybsi', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@fendelmarc', address: 'tz2GP2o3kMJ8Q22FdjBo6QeheqUTAyEkHBo4', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@hplovebux', address: 'tz1Nh672Ln1KRwVgXVdS6NR3NcSWjUSPaFuB', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@HuemansUniverse', address: 'tz1hQFSCGgjvao7sGySD2oY54eVoSruLPFdp', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@JakeKasperr', address: 'tz1WgTFFPa5bBiPM8VYe6BQDrA3VTHx9eNuo', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@328_lad', address: 'tz1aACaaDefdyjVduoFyUi9Rhde6nsmhHunw', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@jouncalba', address: 'tz1T4XVB9bYrM23XetvxKhDAGcEjDd1xFMnq', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@josecarmagnola', address: 'tz1TU3we2NoT51Cv5kpauFAkvvpNqCLndNUh', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@kathonejo', address: 'tz1RJrNjLgJfuJvWEvBgzBXdbeCnL5SKxMyj', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@TunaKuna4', address: 'tz1ZcK7NzwDq8ReeVkFwfvPDBFA6URHLHStz', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@lazarx0x0', address: 'tz1L3bTgxEAFpi4y75pSQRxkniC15MpUY63m', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@HesThatLemon', address: 'tz1V87eXh9a3cHmC6KaskwT9dTuN3KGnKukj', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: 'Lily White', address: 'tz1ZfApCB1rmfyByn9e1jj1w9jLSY1wfu9dm', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@lu_n4ri4', address: 'tz1T8VzKvMSaGL7kKdeRCFTJV7wUv5eLokT3', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@velvetpotassium', address: 'tz1dZuHXtecEbHqj7S1VCAvFSRA4z8myvFQm', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@mandalaaffects', address: 'tz1iPYWAgx3BorGCu9u5YzNYwRauN7biLjxZ', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@marco_port', address: 'tz1f3gLVMRo5apo4ZGu4vdFh55DoJPziCak9', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@thiscleofis', address: 'tz1ftQT2ZZcTbARwkYqT2XmG7xgcY8rokv3w', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@atmikeywilson', address: 'tz1aEkkopAVVFRx6wA45EsbVXy44Tce7BBNH', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Mitomante', address: 'tz1c2UidmoEWanWSYNik2WhBbdPmPckChyVj', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@myknash', address: 'tz1gVbpaamDxgfZySTqKmG69AHrKZeb2pxmy', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Naevio3d', address: 'tz1ftYUEJkHvxp5a1Uwph7MSj9w95uc7nJPF', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@nejoout', address: 'tz1MgTimjYva2rYdahBCayvyMrhVTEyZhG5q', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@NikoAlerce', address: 'tz1WNzaqX3KWbBbGtDJRR4Z7ZcVQRpKqcizb', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@novakai666', address: 'tz1QyjWYQ99kUVXaAerk4Cu6VKmiwaaxref6', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@paldipaldi', address: 'tz1SGruEKdYcoYpaApv2XkNNq8Fiygf5h8FB', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@nefetesudaca', address: 'tz1Qa8jtsEuNZnWvn8KgSNgsRojvbWhsB4v3', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@PanchoDelPuebl0', address: 'tz1cYKtTdpLRdm5TADiY1Xy3sND6moPMzVRb', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@PapaBeardedNFTs', address: 'tz1QVvTNBH8D5Y3br7a1W9qvLepseCMDa8he', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@pauherlive', address: 'tz1eGv9jkBN45kRUNAjMoBEcZxaenAfcDzdS', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Paul_T_M', address: 'tz2CcTzrLDhqFK1Bqt9iiVSPGDezvbnXntpe', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@PixelSushiRobot', address: 'tz1ghSu5zo6Z3W2n3z9fBBw9sCX9KF7Uc9xx', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Lowtrippy', address: 'tz1LHQ9kYw6wzpQBbJCnZaH3TXZgGvg6Rj1u', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@darkwheelnft', address: 'tz1Tptyp72n38JVuG94HEZXSpKG8w8UGXgrd', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@AuRo404', address: 'tz2Par94ss59B1Nsyw3FrAhABYgxbVa5ygAD', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@leftsilverhand', address: 'tz1LNDLoU3Juoc6sWeKbHRsoCNtP1GTJXvRQ', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@unitedsaints', address: 'tz1L5weVPFzw7VuTPY8JZdmFVDyrmfAEdhSu', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@salawaki_3000', address: 'tz1Y8Pzjd6QuwwS9qREaKr1hvW4KMG2mtHNd', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@sansfomo', address: 'tz1Yx6cVjG8KF3Q1a96GDx9QeSdKJ18C88HN', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@ttimmee', address: 'tz1PwqkrfqAgaJ2iSM3SqxwCBs61UoC2H8gA', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@solsuarezsoy', address: 'tz1LhfEBd495G2Ziue5KG9hP6xiJF9tUT34P', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: 'taka_shoshi', address: 'tz1QWDWKtnv56mndaTWhfNB5nguGq8WJotbf', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@Terabitcoins', address: 'tz1aDMTmHXu6fpmSnUVSLr7YTkYVMxjFEdqc', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@realTheoWayne', address: 'tz1axgFJToEZH48t3Aan1tg1bVMFQVpi7qBz', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@tornado_ilus', address: 'tz1Px37t8zCiTybSKnXhkuqzdGY5ZtivugaD', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@unrealb0x', address: 'tz1an3vLu31ouUyHifHhNZ5by1843yprNY8n', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@UygarNFT', address: 'tz1i1hAWBHGFwntJasxBmJGMsRJEpQ9G43uX', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@GummyLSD', address: 'tz1Paqzqbzr77BMp1bMMKj6f3umYZPzXGE8q', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@umbcrew', address: 'tz2TUYv7vbkL9PyRABFGryMgaBEkPMRDyRwC', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() },
  { handle: '@YinYangYoeshi', address: 'tz1ae2d1BJt7YUqaaec6Xenh3mBqS7VjSZtK', balance: (Math.floor(Math.random() * 100000) * 1e8).toString() }
];

// Function to fetch token balance for an address
async function getTokenBalance(address) {
  try {
    console.log(`Fetching balance for ${address}...`);
    const contract = await tezos.contract.at(WTF_TOKEN_CONTRACT);
    
    // For FA2 tokens, we need to use the correct view to get the balance
    const balanceResponse = await contract.views
      .balance_of([{ owner: address, token_id: WTF_TOKEN_ID }])
      .read();
    
    console.log(`Raw balance response for ${address}:`, balanceResponse);
    
    // Extract the balance value from the response
    // The response is an array with a single object containing the balance
    const balance = balanceResponse[0]?.balance?.toString() || '0';
    console.log(`Extracted balance for ${address}:`, balance);
    
    return balance;
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    return '0';
  }
}

// Function to update all balances
async function updateAllBalances() {
  console.log('Updating balances from Tezos blockchain...');
  const balancePromises = realAddresses.map(async (address) => {
    try {
      const balance = await getTokenBalance(address.address);
      console.log(`Updated balance for ${address.handle}: ${balance}`);
      return {
        ...address,
        balance
      };
    } catch (error) {
      console.error(`Error updating balance for ${address.address}:`, error);
      return address;
    }
  });
  
  // Wait for all balance updates to complete
  const updatedAddresses = await Promise.all(balancePromises);
  
  // Update the realAddresses array with new balances
  realAddresses.length = 0;
  realAddresses.push(...updatedAddresses);
  
  // Sort by balance in descending order using BigInt for comparison
  realAddresses.sort((a, b) => {
    const balanceA = BigInt(a.balance || '0');
    const balanceB = BigInt(b.balance || '0');
    return balanceB > balanceA ? 1 : balanceB < balanceA ? -1 : 0;
  });
  
  console.log('Balances updated and sorted successfully');
}

// Update balances every 5 minutes
setInterval(updateAllBalances, 5 * 60 * 1000);

// Initial balance update
updateAllBalances().catch(console.error);

// Sample token info
const sampleTokenInfo = {
  tokenInfo: {
    contract: WTF_TOKEN_CONTRACT,
    tokenId: WTF_TOKEN_ID,
    metadata: {
      name: 'WTF is a token?',
      symbol: 'WTF',
      decimals: 8,
      description: 'WTF is an official token of WTF is a gameshow?'
    }
  }
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    return res.end();
  }
  
  // Handle API endpoints
  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    // API endpoint for token info
    if (req.url === '/api/token-info') {
      return res.end(JSON.stringify(sampleTokenInfo));
    }
    
    // API endpoint for balances
    if (req.url === '/api/balances' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { addresses } = JSON.parse(body);
          
          // If no addresses provided, return all addresses for the leaderboard
          if (!addresses || addresses.length === 0) {
            return res.end(JSON.stringify({ 
              balances: realAddresses.map(item => ({ 
                address: item.address, 
                balance: item.balance,
                handle: item.handle 
              })) 
            }));
          }
          
          // Otherwise, return requested addresses
          const result = addresses.map(address => {
            const found = realAddresses.find(item => item.address === address);
            if (found) {
              return {
                address: found.address,
                balance: found.balance,
                handle: found.handle
              };
            }
            return {
              address,
              balance: '0',
              handle: ''
            };
          });
          
          res.end(JSON.stringify({ balances: result }));
        } catch (error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
      
      return;
    }
    
    // Single balance endpoint
    if (req.url.startsWith('/api/balance/') && req.method === 'GET') {
      const address = req.url.split('/api/balance/')[1];
      const found = realAddresses.find(item => item.address === address);
      
      if (found) {
        return res.end(JSON.stringify({
          address: found.address,
          balance: found.balance,
          handle: found.handle
        }));
      }
      
      return res.end(JSON.stringify({
        address,
        balance: '0',
        handle: ''
      }));
    }
    
    // If API endpoint not found
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
  
  // Handle static file requests
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  // Ensure we're not going outside the public directory
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If file not found, serve index.html (for SPA routing)
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end('Server Error');
          } else {
            res.setHeader('Content-Type', 'text/html');
            res.end(data, 'utf-8');
          }
        });
      } else {
        // Other server error
        res.statusCode = 500;
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success - serve the file
      res.setHeader('Content-Type', contentType);
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Leaderboard tracking ${realAddresses.length} Tezos addresses with their X handles.`);
}); 