// index.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports
require('dotenv').config()
const dapr = require('@dapr/dapr');
const merge = require('object-merge');
const table = require('table');
const express = require('express')
const app = express()
const post = require("./post")
const get = require("./get")

app.use(express.json())
app.use(express.urlencoded());
app.use(express.static("public"))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Constants

const SERVER_HOST = process.env.CNS_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.CNS_SERVER_PORT || '3100';

const DAPR_HOST = process.env.CNS_DAPR_HOST || 'localhost';
const DAPR_PORT = process.env.CNS_DAPR_PORT || '3500';

const CNS_DAPR = process.env.CNS_DAPR || 'cns-dapr';
const CNS_PUBSUB = process.env.CNS_PUBSUB || 'cns-pubsub';
const CNS_CONTEXT = process.env.CNS_CONTEXT || '';

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT
});

// Dapr server

const server = new dapr.DaprServer({
  serverHost: SERVER_HOST,
  serverPort: SERVER_PORT,
  clientOptions: {
    daprHost: DAPR_HOST,
    daprPort: DAPR_PORT
  }
});

// Local data

var node = {};
var updates = 0;

//Display results
function display(data) {
  // Merge changes
  node = merge(node, data);

  // Show update number
  console.log(table.table([['Update #' + ++updates]]).trim());

  // Show node metadata changes
  const m = [];

  for (const name in data) {
    if (name !== 'connections')
      m.push([name, data[name]]);
  }

  if (m.length > 0) {
    console.log(table.table(m, {
      header: { content: 'Node Metadata', alignment: 'center', truncate: 80 },
      columns: {
        0: { width: 16, truncate: 16 },
        1: { width: 57, wrapWord: true }
      }
    }).trim());
  }

  // Show connection changes
  for (const id in data.connections) {
    const conn = node.connections[id];

    // Was connection deleted?
    if (conn === null) {
      console.log(table.table([['Connection ' + id + ' Deleted']]).trim());
      delete node.connections[id];
      continue;
    }

    const c = [];
    const p = [];

    // Add connection metadata
    for (const name in conn) {
      if (name !== 'properties')
        c.push([name, conn[name]]);
    }

    // Add connection properties
    for (const name in conn.properties)
      p.push([name, '│', conn.properties[name]]);

    c.push(['properties', table.table(p, {
      border: table.getBorderCharacters('void'),
      columnDefault: {
        paddingLeft: 0,
        paddingRight: 1
      },
      columns: {
        0: { width: 16, truncate: 16 },
        1: { width: 1 },
        2: { width: 38, truncate: 38 }
      },
      drawHorizontalLine: () => false
    }).trim()]);

    // Show connection
    console.log(table.table(c, {
      header: { content: 'Connection ' + id, alignment: 'center', truncate: 80 },
      columns: {
        0: { width: 16, truncate: 16 },
        1: { width: 57, wrapWord: true }
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

  // Fetch current
  var res;

  try {
    res = await client.invoker.invoke(
      CNS_DAPR,
      CNS_CONTEXT,
      dapr.HttpMethod.GET);
  } catch (e) {
    // Failure
    throw new Error('bad request');
  }

  // CNS Dapr error?
  if (res.error !== undefined)
    throw new Error(res.error);

  // Display results
  display(res.data);

  // Subscribe to changes
  server.pubsub.subscribe(
    CNS_PUBSUB,
    CNS_CONTEXT,
    display);

  // Start server
  await server.start();
}

// Start application
start().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.render("home");
})

app.post("/post", (req, res) => {
  post.start(req.body["response-level"]).then(function (result) {
    res.send(JSON.stringify(result));
  }).catch((e) => {
    res.send('Get Error: ' + e.message);
  })
})

app.get("/get/:attribute", (req, res) => {
  get.start(req.params.attribute).then(function (result) {
    res.send(JSON.stringify(result));
  }).catch((e) => {
    res.send('Get Error: ' + e.message);
  })
})

app.listen(process.env.PORT || 5500)
