#!/usr/bin/env node
const os = require('os');
const {
  promises: { readFile, writeFile },
} = require('fs');
const { program } = require('commander');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const yaml = require('js-yaml');

(async () => {
  const options = program
    .description('Configure ticker with Alpaca.markets positions')
    .requiredOption('-k, --keyId <id>', 'Your Alpaca API Key ID')
    .requiredOption('-s, --secretKey <key>', 'Your Alpaca API Secret Key')
    .requiredOption('-rw, --reset-watchlist', 'Replace existing watchlist with positions', false)
    .parse()
    .opts();

  const alpaca = new Alpaca({
    keyId: options.keyId,
    secretKey: options.secretKey,
  });

  const configPath = (options.config || '~/.ticker.yaml').replace('~', os.homedir());
  const defaultConfig = {
    'show-summary': true,
    'show-tags': true,
    'show-fundamentals': true,
    'show-separator': true,
    'show-holdings': true,
    interval: 5,
    currency: 'USD',
    watchlist: [],
    lots: [],
  };
  let newTickerConfig = { ...defaultConfig };
  let existingConfig;
  let positions = [];

  try {
    const configFile = await readFile(configPath, 'utf8');
    existingConfig = yaml.load(configFile);
  } catch (error) {
    console.log('Existing Ticker config not found.');
  }

  try {
    positions = await alpaca.getPositions();
  } catch (error) {
    console.log('Unable to fetch Alpaca positions.');
  }

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
    console.log(`New config file saved with ${newTickerConfig.lots.length} positions.`);
  } catch (error) {
    console.log('Unable to write new config file.');
  }
})();
