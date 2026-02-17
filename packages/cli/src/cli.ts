#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { RecursaSDK, CONTRACTS, PROTOCOLS, TOKENS, type Address } from 'recursa-sdk';

const program = new Command();
const sdk = new RecursaSDK();

program
  .name('recursa')
  .description('CLI for RecursaAI - Lending Rate Aggregator on Monad')
  .version('1.0.0');

// ═══════════════════════════════════════════════════════════════
//                         COMMANDS
// ═══════════════════════════════════════════════════════════════

program
  .command('rates')
  .description('Get lending rates across all protocols')
  .option('-a, --asset <address>', 'Asset address (default: WMON)')
  .action(async (options) => {
    const spinner = ora('Fetching rates...').start();
    
    try {
      const asset = (options.asset || TOKENS.WMON) as Address;
      const rates = await sdk.getRates(asset);
      
      spinner.succeed('Rates fetched');
      
      console.log('\n' + chalk.bold('📊 Lending Rates on Monad'));
      console.log(chalk.dim('─'.repeat(50)));
      
      for (const rate of rates) {
        console.log(`\n${chalk.cyan(rate.protocol)}`);
        console.log(`  Supply APY: ${chalk.green(rate.supplyAPY.toFixed(2) + '%')}`);
        console.log(`  Borrow APY: ${chalk.yellow(rate.borrowAPY.toFixed(2) + '%')}`);
      }
      
      console.log('\n' + chalk.dim('─'.repeat(50)));
      console.log(chalk.bold.green(`✨ Best supply rate: ${rates[0].protocol} (${rates[0].supplyAPY.toFixed(2)}%)`));
      
    } catch (error) {
      spinner.fail('Failed to fetch rates');
      console.error(chalk.red(error));
    }
  });

program
  .command('best')
  .description('Find the best rate for an action')
  .argument('<action>', 'Action: supply or borrow')
  .option('-a, --asset <address>', 'Asset address (default: WMON)')
  .action(async (action, options) => {
    const spinner = ora(`Finding best ${action} rate...`).start();
    
    try {
      const asset = (options.asset || TOKENS.WMON) as Address;
      const rate = await sdk.getBestRate(asset, action as 'supply' | 'borrow');
      
      if (!rate) {
        spinner.fail('No rates found');
        return;
      }
      
      spinner.succeed('Best rate found');
      
      console.log('\n' + chalk.bold(`🎯 Best ${action} rate`));
      console.log(chalk.dim('─'.repeat(40)));
      console.log(`Protocol: ${chalk.cyan(rate.protocol)}`);
      console.log(`APY: ${chalk.green(action === 'supply' ? rate.supplyAPY.toFixed(2) : rate.borrowAPY.toFixed(2))}%`);
      
    } catch (error) {
      spinner.fail('Failed');
      console.error(chalk.red(error));
    }
  });

program
  .command('position')
  .description('Get position details')
  .argument('<id>', 'Position ID')
  .action(async (id) => {
    const spinner = ora('Fetching position...').start();
    
    try {
      const position = await sdk.getPosition(BigInt(id));
      
      if (!position) {
        spinner.fail('Position not found');
        return;
      }
      
      spinner.succeed('Position found');
      
      console.log('\n' + chalk.bold(`📈 Position #${id}`));
      console.log(chalk.dim('─'.repeat(40)));
      console.log(`Owner: ${chalk.cyan(position.owner)}`);
      console.log(`Collateral: ${position.collateral}`);
      console.log(`Debt: ${position.debt}`);
      console.log(`Leverage: ${Number(position.leverage) / 1e18}x`);
      console.log(`Active: ${position.active ? chalk.green('Yes') : chalk.red('No')}`);
      
    } catch (error) {
      spinner.fail('Failed');
      console.error(chalk.red(error));
    }
  });

program
  .command('health')
  .description('Get health factor for a position')
  .argument('<id>', 'Position ID')
  .action(async (id) => {
    const spinner = ora('Checking health...').start();
    
    try {
      const hf = await sdk.getHealthFactor(BigInt(id));
      const healthFactor = Number(hf) / 1e18;
      
      spinner.succeed('Health factor retrieved');
      
      const color = healthFactor >= 1.5 ? chalk.green : healthFactor >= 1.2 ? chalk.yellow : chalk.red;
      console.log(`\nHealth Factor: ${color(healthFactor.toFixed(4))}`);
      
      if (healthFactor < 1.2) {
        console.log(chalk.red('⚠️  Warning: Position at risk of liquidation!'));
      }
      
    } catch (error) {
      spinner.fail('Failed');
      console.error(chalk.red(error));
    }
  });

program
  .command('contracts')
  .description('List deployed contract addresses')
  .action(() => {
    console.log('\n' + chalk.bold('📜 RecursaAI Contracts on Monad Mainnet'));
    console.log(chalk.dim('─'.repeat(60)));
    
    console.log(`\n${chalk.cyan('Core:')}`);
    console.log(`  LooperLite:        ${CONTRACTS.looperLite}`);
    console.log(`  LendingAggregator: ${CONTRACTS.lendingAggregator}`);
    
    console.log(`\n${chalk.cyan('Adapters:')}`);
    console.log(`  NeverlendAdapter:  ${CONTRACTS.neverlendAdapter}`);
    console.log(`  MaceAdapter:       ${CONTRACTS.maceAdapter}`);
    
    console.log(`\n${chalk.cyan('Protocols:')}`);
    for (const [key, protocol] of Object.entries(PROTOCOLS)) {
      console.log(`  ${protocol.name}: ${Object.values(protocol)[1]}`);
    }
    
    console.log(`\n${chalk.cyan('Tokens:')}`);
    console.log(`  WMON: ${TOKENS.WMON}`);
    console.log(`  USDC: ${TOKENS.USDC}`);
  });

program
  .command('protocols')
  .description('List supported lending protocols')
  .action(() => {
    console.log('\n' + chalk.bold('🏦 Supported Protocols'));
    console.log(chalk.dim('─'.repeat(40)));
    
    const protocols = [
      { name: 'Euler V2', status: '✅ Live' },
      { name: 'Curvance', status: '✅ Live' },
      { name: 'Morpho', status: '✅ Live' },
      { name: 'Neverlend', status: '✅ Live (Real Adapter)' },
    ];
    
    for (const p of protocols) {
      console.log(`  ${chalk.cyan(p.name)}: ${chalk.green(p.status)}`);
    }
  });

program.parse();
