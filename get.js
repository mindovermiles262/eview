// get.js - Dapr CNS client
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_APP_ID = process.env.CNS_APP_ID || 'cns-dapr';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Client application
async function start() {
  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method node --verb GET
  var res;

  try {
    const method = process.argv[2] || 'node';
    res = await client.invoker.invoke(CNS_APP_ID, method, dapr.HttpMethod.GET);
  } catch(e) {
    // Failure
    throw new Error('bad request');
  }

  // Display response
  console.log(JSON.stringify(res, null, 2));
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
