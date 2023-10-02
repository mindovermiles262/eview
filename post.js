// post.js - Dapr CNS client
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');

// Constants

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_APP_ID = 'cns-dapr';

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
  try {
    const method = process.argv[2] || 'node/comment';
    const data = process.argv[3] || 'Testing';

    const res = await client.invoker.invoke(CNS_APP_ID, method, dapr.HttpMethod.POST, data);

    if (res.error !== undefined)
      throw new Error(res.error);

    // Success
    console.log(data);
  } catch(e) {
    // Failure
    console.error('Error!');
  }

/*
"publish": "dapr publish --publish-app-id cns-dapr-client --pubsub cns --topic node --data '{\"key\":\"value\"}'",
const res3 = await client.pubsub.publish(
  CNS_APP_ID,
  'data', {
    payload: 'hello, world!'
  });

console.log(res3);
*/

}

// Start application
start().catch((e) => {
  console.error(e);
  process.exit(1);
});
