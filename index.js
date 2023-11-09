// index.js - Dapr CNS client
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');
const merge = require('object-merge');
const table = require('table');

// Constants

const SERVER_HOST = process.env.CNS_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.CNS_SERVER_PORT || '3100';

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_APP_ID = process.env.CNS_APP_ID || 'cns-dapr';
const CNS_PUBSUB = process.env.CNS_PUBSUB || 'cns-pubsub';

// Dapr server

const server = new dapr.DaprServer({
  serverHost: SERVER_HOST,
  serverPort: SERVER_PORT,
  clientOptions: {
    daprHost: DAPR_HOST,
    daprPort: DAPR_PORT,
    logger: {level: dapr.LogLevel.Error}
  }
});

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT,
  logger: {level: dapr.LogLevel.Error}
});

// Local data

var node = {};
var updates = 0;

// Update changes
function update(data) {
  // Merge changes
  node = merge(node, data);

  console.log(table.table([['Update #' + ++updates]]).trim());

  const m = [];

  for (const name in data)
    if (name !== 'connections')
      m.push([name, data[name]]);

  const columns = {
    0: {width: 10},
    1: {width: 64, wrapWord: true}
  };

  if (m.length > 0) {
    console.log(table.table(m, {
      header: {content: 'Meta Data', alignment: 'center'},
      columns: columns
    }).trim());
  }

  for (const id in data.connections) {
    const conn = node.connections[id];

    const c = [];
    const p = [];

    for (const name in conn)
      if (name !== 'properties')
        c.push([name, conn[name]]);

    for (const name in conn.properties)
      p.push([name, '│', conn.properties[name]]);

    c.push(['properties', table.table(p, {
      border: table.getBorderCharacters('void'),
      columnDefault: {paddingLeft: 0, paddingRight: 1, truncate: 50},
      drawHorizontalLine: () => false
    }).trim()]);

    console.log(table.table(c, {
      header: {content: 'Connection ' + id, alignment: 'center'},
      columns: columns
    }).trim());
  }
}

// Client application
async function start() {
  // Start client
  await client.start();

  // Fetch current
  const res = await client.invoker.invoke(CNS_APP_ID, 'node', dapr.HttpMethod.GET);

  // Server error?
  if (res.error !== undefined)
    console.error('Error:', res.error);
  else update(res.data);

  // Subscribe to changes
  server.pubsub.subscribe(CNS_PUBSUB, 'node', update);

  // Start server
  await server.start();
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
