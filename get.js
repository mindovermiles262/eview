// get.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_DAPR = process.env.CNS_DAPR || 'cns-dapr';
const CNS_CONTEXT = process.env.CNS_CONTEXT || '';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Client application
async function start(attribute) {
  // No context?
  if (CNS_CONTEXT === '')
    throw new Error('not configured');

  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method <context> --verb GET
  var res;

  try {
    const method = process.argv[2] || CNS_CONTEXT + '/connections/' + process.env.CNS_CONNECTION_ID + '/properties/' + attribute;
    res = await client.invoker.invoke(CNS_DAPR, method, dapr.HttpMethod.GET);
  } catch (e) {
    // Failure
    throw new Error('bad request');
  }

  // Display response
  console.log(attribute + ": " + res.data);
  return res.data
}

module.exports.start = start
