
const query = `
  SELECT open_time, open, high, low, close, volume
  FROM \`${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
  WHERE symbol = @symbol
  AND interval = @interval
  AND open_time BETWEEN @start AND @end
  ORDER BY open_time ASC
`;

const [rows] = await bigquery.query({
  query,
  params: {
    symbol,
    interval: timeframe, // changed key name
    start: startDate,
    end: endDate,
  },
});
