module.exports = (portfolio) => {
  const today = new Date().toLocaleDateString();
  const positions = [
    [
      'Symbol',
      'Current Price',
      'Date',
      'Time',
      'Change',
      'Open',
      'High',
      'Low',
      'Volume',
      'Trade Date',
      'Purchase Price',
      'Quantity',
      'Commission',
      'High Limit',
      'Low Limit',
      'Comment',
    ],
  ];

  for (let i = 0; i < portfolio.length; i++) {
    const position = portfolio[i];

    positions.push([
      position.symbol,
      new Array(9).join(','),
      Number.parseFloat(position.avg_entry_price),
      Number.parseFloat(position.qty),
      new Array(3).join(','),
      today,
    ]);
  }

  const positionsCSV = positions.map((p) => p.join(',')).join('\n');
  return positionsCSV;
};
