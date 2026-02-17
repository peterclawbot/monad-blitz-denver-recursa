# RecursaAI Skill

> AI-powered lending rate aggregator for Monad

## Description

RecursaAI aggregates lending rates across multiple protocols on Monad (Euler V2, Curvance, Morpho, Neverlend) and automatically finds the best rates for supply and borrow operations. It also enables leveraged looping positions through automated collateral management.

## Capabilities

- **Rate Aggregation**: Query and compare lending rates across 4 protocols
- **Best Rate Finding**: Automatically find optimal rates for supply/borrow
- **Position Management**: Create, monitor, and close leveraged loop positions
- **Health Monitoring**: Track position health factors and liquidation risk

## Commands

### Get Lending Rates
```bash
recursa rates                    # Get all rates for WMON
recursa rates --asset 0x...      # Get rates for specific asset
```

### Find Best Rate
```bash
recursa best supply              # Best supply rate
recursa best borrow              # Best borrow rate
```

### Position Management
```bash
recursa position <id>            # Get position details
recursa health <id>              # Check health factor
```

### Info Commands
```bash
recursa contracts                # List deployed contracts
recursa protocols                # List supported protocols
```

## SDK Usage

```typescript
import { RecursaSDK, TOKENS } from 'recursa-sdk';

const sdk = new RecursaSDK();

// Get all rates
const rates = await sdk.getRates(TOKENS.WMON);
console.log('Best supply rate:', rates[0]);

// Find best rate
const best = await sdk.getBestRate(TOKENS.USDC, 'supply');
console.log('Best protocol:', best.protocol);

// Get position
const position = await sdk.getPosition(1n);
console.log('Position active:', position.active);

// Check health
const hf = await sdk.getHealthFactor(1n);
console.log('Health factor:', Number(hf) / 1e18);
```

## Contract Addresses (Monad Mainnet)

| Contract | Address |
|----------|---------|
| LooperLite | `0xd72d67be2b4b199d1a598a1Ed7B1A7c20c88f7c8` |
| LendingAggregator | `0x263bF7D5db487B6480CE240DF9347649bd062EFb` |
| NeverlendAdapter | `0x876c9Ae0Fde6852160644fEf69B0D31e2D221063` |
| MaceAdapter | `0x649A0f5D8b214BF72C810Abbe7190cB4670AB6c7` |

## Supported Protocols

1. **Euler V2** - EVC-based lending
2. **Curvance** - Compound-style markets
3. **Morpho** - Morpho Blue peer-to-peer
4. **Neverlend** - Aave V2 fork (real adapter deployed)

## Tokens

| Token | Address |
|-------|---------|
| WMON | `0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701` |
| USDC | `0x947dD48236C3cBb6f3ee40468235166b7197eAD5` |

## Live Demo

🔗 **https://recursahackathon-production.up.railway.app**

## Installation

```bash
npm install -g recursa-cli
# or
npx recursa-cli rates
```

## For AI Agents

When integrating with AI agents:

1. Use the CLI for quick queries: `recursa rates`, `recursa best supply`
2. Use the SDK for programmatic access in Node.js environments
3. All rate data is real-time from Monad mainnet
4. Health factor < 1.2 indicates liquidation risk

## Example AI Agent Workflow

```
User: "What's the best place to supply USDC on Monad?"

Agent:
1. Run: recursa best supply --asset 0x947dD48236C3cBb6f3ee40468235166b7197eAD5
2. Parse output to find best protocol and rate
3. Respond with recommendation
```
