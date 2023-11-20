// post.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_DAPR = process.env.CNS_DAPR || 'cns-dapr';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Client application
async function start() {
  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method node/comment --verb POST --data "Testing"
  var res;

  try {
    const method = process.argv[2] || 'node/comment';
    var data = process.argv[3] || 'Testing';

    try {data = JSON.parse(data);}
    catch(e) {}

    res = await client.invoker.invoke(CNS_DAPR, method, dapr.HttpMethod.POST, data);
  } catch(e) {
    // Failure
    throw new Error('bad request');
  }

  // CNS Dapr error?
  if (res.error !== undefined)
    throw new Error(res.error);

  // Success
  console.log('Ok');
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
