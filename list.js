// list.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');
const wildcard = require('wildcard');
const table = require('table');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_DAPR = process.env.CNS_DAPR || 'cns-dapr';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Display results
function display(data, profile, role) {
  const c = [['Profile', 'Role', 'Server', 'Client', 'Status', 'ID']];

  // Display connections
  for (const id in data.connections) {
    const conn = data.connections[id];

    // Filter by profile and role
    if ((profile === undefined || wildcard(profile, conn.profile)) &&
      (role === undefined || conn.role === role))
      c.push([conn.profile, conn.role, conn.server, conn.client, conn.status, id]);
  }

  // Display results
  console.log(table.table((c.length <= 1)?[['No connections']]:c));
}

// Client application
async function start() {
  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method node --verb GET
  var res;

  try {
    res = await client.invoker.invoke(CNS_DAPR, 'node', dapr.HttpMethod.GET);
  } catch(e) {
    // Failure
    throw new Error('bad request');
  }

  // CNS Dapr error?
  if (res.error !== undefined)
    throw new Error(res.error);

  // Display response
  display(res.data, process.argv[2], process.argv[3]);
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
