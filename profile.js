// profile.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const dapr = require('@dapr/dapr');
const table = require('table');

// Constants

const SERVER_HOST = process.env.CNS_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.CNS_SERVER_PORT || '3100';

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_DAPR = process.env.CNS_DAPR || 'cns-dapr';
const CNS_CONTEXT = process.env.CNS_CONTEXT || '';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Display results
function display(data) {
  // Show profile metadata
  const m = [];

  for (const name in data) {
    if (name !== 'versions')
      m.push([name, data[name]]);
  }

  console.log(table.table(m, {
    header: {content: 'Profile Metadata', alignment: 'center', truncate: 80},
    columns: {
      0: {width: 16, truncate: 16},
      1: {width: 57, wrapWord: true}
    }
  }).trim());

  var ver = 0;

  // Show profile versions
  for (const version of data.versions) {
    const v = [];

    // Add properties and flags
    for (const property of version.properties) {
      var flags = '';

      flags += (property.server === null)?'S':'-';
      flags += (property.propagate === null)?'P':'-';
      flags += (property.required === null)?'R':'-';

      v.push([property.name, property.description, flags]);
    }

    // Show profile
    console.log(table.table(v, {
      header: {content: 'Version #' + ++ver, alignment: 'center', truncate: 80},
      columns: {
        0: {width: 16, truncate: 16},
        1: {width: 51, wrapWord: true},
        2: {width: 3}
      }
    }).trim());
  }
}

// Client application
async function start() {
  // No context?
  if (CNS_CONTEXT === '')
    throw new Error('not configured');

  // Start client
  await client.start();

  // Fetch profile
  var res;

  try {
    const profile = process.argv[2] || 'test.abc';

    res = await client.invoker.invoke(
      CNS_DAPR,
      'profiles/' + profile,
      dapr.HttpMethod.GET);
  } catch(e) {
    // Failure
    throw new Error('bad request');
  }

  // CNS Dapr error?
  if (res.error !== undefined)
    throw new Error(res.error);

  // Display results
  display(res.data);
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
