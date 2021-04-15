#!/usr/bin/env node
const os = require('os');
const {
  promises: { readFile, writeFile },
} = require('fs');
const { resolve } = require('path');
const { version } = require('./package.json');
const { Command } = require('commander');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const yaml = require('js-yaml');

(async () => {
  const program = new Command();

  program
    .description('Configure Ticker with Alpaca.markets positions')
    .version(version, '-v, --version', 'output the current version')
    .requiredOption('-k, --keyId <id>', 'Your Alpaca API Key ID')
    .requiredOption('-s, --secretKey <key>', 'Your Alpaca API Secret Key')
    .option('--ticker-config <filepath>', 'Path (with filename) to Ticker config YAML', `${os.homedir()}/.ticker.yaml`)
    .option('--reset-watchlist', 'Replace existing Ticker watchlist with positions', false);

  program.parse();

  const options = program.opts();

  const configPath = resolve(options.tickerConfig);
  let existingConfig;
  try {
    const configFile = await readFile(configPath, 'utf8');
    existingConfig = yaml.load(configFile);
  } catch (error) {
    console.log('Existing Ticker config not found.');
  }

  const alpaca = new Alpaca({
    keyId: options.keyId,
    secretKey: options.secretKey,
  });
  let positions = [];
  try {
    positions = await alpaca.getPositions();
  } catch (error) {
    console.log('Unable to fetch Alpaca positions.');
  }

  let newTickerConfig = {
    watchlist: [],
    lots: [],
  };
  if (existingConfig) {
    delete existingConfig.lots;
    if (options.resetWatchlist) delete existingConfig.watchlist;

    newTickerConfig = {
      ...newTickerConfig,
      ...existingConfig,
    };
  }

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];

    newTickerConfig.watchlist.push(position.symbol);
    newTickerConfig.lots.push({
      symbol: position.symbol,
      quantity: Number.parseFloat(position.qty),
      unit_cost: Number.parseFloat(position.avg_entry_price),
    });
  }

  newTickerConfig.watchlist = [...new Set(newTickerConfig.watchlist)];

  try {
    await writeFile(configPath, yaml.dump(newTickerConfig));
    console.log(`New Ticker config file saved with ${newTickerConfig.lots.length} positions.`);
  } catch (error) {
    console.log('Unable to write new Ticker config file.');
  }
})();
