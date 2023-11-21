// publish.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_PUBSUB = process.env.CNS_PUBSUB || 'cns-pubsub';
const CNS_CONTEXT = process.env.CNS_CONTEXT || '';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Client application
async function start() {
  // No context?
  if (CNS_CONTEXT === '')
    throw new Error('not configured');

  // Start client
  await client.start();

  // dapr publish --publish-app-id cns-dapr --pubsub cns-pubsub --topic <context> --data '{"comment":"Testing"}'
  try {
    const topic = process.argv[2] || CNS_CONTEXT;
    const payload = process.argv[3] || '{"comment":"Testing"}';

    await client.pubsub.publish(
      CNS_PUBSUB,
      topic,
      payload);
  } catch(e) {
    // Failure
    throw new Error('bad request');
  }

  // Success
  console.log('Ok');
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
