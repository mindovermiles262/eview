// publish.js - Dapr CNS client
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_PUBSUB = process.env.CNS_PUBSUB || 'cns-pubsub';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Client application
async function start() {
  // Start client
  await client.start();

  // dapr publish --publish-app-id cns-dapr --pubsub cnspubsub --topic node --data "Testing"
  try {
    const topic = process.argv[2] || 'node';
    const payload = process.argv[3] || 'Testing';

    await client.pubsub.publish(CNS_PUBSUB, topic, payload);
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
