# `alpaca-ticker-config` 🦙 🖥️ 🔧

> Configure Ticker with your Alpaca.markets positions from the command line.

## Summary

[Ticker](https://github.com/achannarasappa/ticker) is a "Terminal stock watcher and stock position tracker."

[Alpaca](https://alpaca.markets/) is an "API for stock trading."

`alpaca-ticker-config` adds your current positions to Ticker by adding them to (or creating) Ticker's config file.

## Usage

Install
```sh
> npm i -g alpaca-ticker-config
```

Have your Alpaca API "Key ID" and "Secret" ready (available on your Alpaca dashboard):

```sh
# check the manual
> alpaca-ticker-config --help

# update or create your Ticker config
> alpaca-ticker-config -k YOURKEYID -s theKeySecret

# run ticker
> ticker
```

## Notes

This CLI will not replace your current Ticker `watchlist`, but it will always add your positions to any existing watchlist.

It will always replace your Ticker `lots` with your current Alpaca positions.

See "Todo" below.

## Caveats

This CLI hasn't been thoroughly tested. However, in the worst case it will save an empty `.ticker.yml` file.

It has only been tested on MacOS.

## Todo

- [X] add option to print instead of save new config
- [X] allow Ticker ~~options~~ config file path to be passed to the config
- [ ] feature to save Alpaca credentials for subsequent runs
