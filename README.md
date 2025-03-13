# Tezos Token Leaderboard

A web application that tracks and displays token balances for a specific Tezos token across multiple wallet addresses, creating a leaderboard of holders.

## Features

- 🏆 Live leaderboard ranking wallet addresses by token balance
- 🔍 Track any number of wallet addresses
- 💾 Persistent storage of tracked addresses using local storage
- 📊 Real-time balance updates
- 🔄 Automatic refresh functionality
- 📱 Responsive design for desktop and mobile

## Token Contract Details

This leaderboard is configured to track the following token:
- **Contract Address**: KT1DUZ2nf4Dd1F2BNm3zeg1TwAnA1iKZXbHD
- **Token ID**: 0

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Adding Addresses

1. Enter a valid Tezos wallet address in the input field (starts with tz1, tz2, tz3, or KT1)
2. Click "Add to Leaderboard" or press Enter
3. The address will be added to the leaderboard with its current token balance

### Refreshing Balances

- Click the "Refresh Balances" button to update all balances in real-time

### Removing Addresses

- Click the "✕" button next to any address to remove it from the leaderboard

## Technical Details

This application consists of:

- **Backend**: Node.js with Express
- **Frontend**: HTML, CSS, JavaScript
- **Blockchain Interaction**: Taquito.js library for Tezos
- **Storage**: Browser's localStorage for persistent address storage

## Customization

To track a different token, modify the following constants in `server.js`:

```javascript
const TOKEN_CONTRACT_ADDRESS = 'your-token-contract-address';
const TOKEN_ID = your-token-id; // Usually 0 for FA1.2 tokens
```

## Limitations

- The application currently queries the Tezos blockchain directly for each request, which may be rate-limited
- Token balance formatting may need adjustment based on the specific token's decimals
- The application attempts to detect the token contract's structure automatically, but some custom contracts may require code adjustments

## License

MIT 