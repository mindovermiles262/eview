# CNS-Dapr Client Examples

## Table of Contents

- [About](#about)
- [Installing](#installing)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [License](#license)
- [Copyright Notice](#copyright-notice)

## About

## Installing

To **install** or **update** the application, you should fetch the latest version from this Git repository. To do that, you may either download and unpack the repo zip file, or clone the repo using:

```sh
git clone https://github.com/cnscp/cns-dapr-client.git
```

Either method should get you a copy of the latest version. It is recommended (but not compulsory) to place the repo in the `~/cns-dapr-client` project directory. Go to the project directory and install Node.js dependancies with:

```sh
npm install
```

Your application should now be ready to rock.

## Usage

Once installed, run the application with:

```sh
npm run start
```

To shut down the application, hit `ctrl-c`.

## Environment Variables

<table>
  <tr><th>Name</th><th>Description</th><th>Default</th></tr>
  <tr><td>CNS_SERVER_HOST</td><td>Example server host</td><td>'localhost'</td></tr>
  <tr><td>CNS_SERVER_PORT</td><td>Example server port</td><td>'3100'</td></tr>
  <tr><td>CNS_DAPR_HOST</td><td>Dapr host</td><td>'localhost'</td></tr>
  <tr><td>CNS_DAPR_PORT</td><td>Dapr port</td><td>'3500'</td></tr>
  <tr><td>CNS_APP_ID</td><td>CNS Dapr application ID</td><td>'cns-dapr'</td></tr>
  <tr><td>CNS_PUBSUB</td><td>CNS Dapr PUBSUB component ID</td><td>'cns-pubsub'</td></tr>
</table>

## License

See [LICENSE.md](./LICENSE.md).

## Copyright Notice

See [COPYRIGHT.md](./COPYRIGHT.md).
