# RecursaAI 🔄

> AI-Powered Lending Rate Aggregator for Monad

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://recursahackathon-production.up.railway.app)
[![Chain](https://img.shields.io/badge/Chain-Monad%20Mainnet-purple)](https://monad.xyz)

## Overview

RecursaAI aggregates lending rates across multiple DeFi protocols on Monad and automatically finds the best rates for your supply and borrow operations. With AI assistance, users can create leveraged looping positions through an intuitive interface.

### Key Features

- 🔍 **Rate Aggregation** - Compare rates across Euler V2, Curvance, Morpho, and Neverlend
- 🤖 **AI Assistant** - Natural language interface for DeFi operations
- 🔄 **Automated Looping** - Create leveraged positions in a single transaction
- 📊 **Real-time Data** - Live rates from Monad mainnet

## Live Demo

🔗 **https://recursahackathon-production.up.railway.app**

## Packages

### SDK (`recursa-sdk`)

TypeScript SDK for integrating RecursaAI into your applications.

```typescript
import { RecursaSDK, TOKENS } from 'recursa-sdk';

const sdk = new RecursaSDK();
const rates = await sdk.getRates(TOKENS.WMON);
const best = await sdk.getBestRate(TOKENS.USDC, 'supply');
```

### CLI (`recursa-cli`)

Command-line tool for quick queries and bot automation.

```bash
# Get all rates
recursa rates

# Find best supply rate
recursa best supply

# Check position health
recursa health 1

# List contracts
recursa contracts
```

## Deployed Contracts (Monad Mainnet)

| Contract | Address | Description |
|----------|---------|-------------|
| LooperLite | `0xd72d67be2b4b199d1a598a1Ed7B1A7c20c88f7c8` | Leveraged looping engine |
| LendingAggregator | `0x263bF7D5db487B6480CE240DF9347649bd062EFb` | Rate aggregation |
| NeverlendAdapter | `0x876c9Ae0Fde6852160644fEf69B0D31e2D221063` | Neverlend integration |
| MaceAdapter | `0x649A0f5D8b214BF72C810Abbe7190cB4670AB6c7` | Mace DEX integration |

## Supported Protocols

| Protocol | Type | Status |
|----------|------|--------|
| Euler V2 | EVC-based lending | ✅ Live |
| Curvance | Compound-style | ✅ Live |
| Morpho | Peer-to-peer | ✅ Live |
| Neverlend | Aave V2 fork | ✅ Live (Real Adapter) |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    RecursaAI                         │
├─────────────────────────────────────────────────────┤
│  Frontend (Next.js + RainbowKit)                    │
│  ├── AI Assistant (Natural Language)                │
│  ├── Rate Comparison UI                             │
│  └── Position Management                            │
├─────────────────────────────────────────────────────┤
│  Smart Contracts (Solidity 0.8.28)                  │
│  ├── LooperLite        - Leveraged looping          │
│  ├── LendingAggregator - Rate queries               │
│  ├── NeverlendAdapter  - Aave V2 interface          │
│  └── MaceAdapter       - DEX routing                │
├─────────────────────────────────────────────────────┤
│  External Protocols                                 │
│  ├── Euler V2    (0x7a93...)                        │
│  ├── Curvance    (0xE01d...)                        │
│  ├── Morpho      (0x82b6...)                        │
│  ├── Neverlend   (0x80F0...)                        │
│  └── Mace DEX    (0x6F05...)                        │
└─────────────────────────────────────────────────────┘
```

## For AI Agents

See [SKILL.md](./SKILL.md) for AI agent integration guide.

## Team

Built by **Harm** for Monad Blitz @ ETHDenver 2026

## Links

- 🌐 [Live Demo](https://recursahackathon-production.up.railway.app)
- 📖 [SKILL.md](./SKILL.md)
- 🔗 [Monad](https://monad.xyz)
