# WindRanger Governance Snapshot-Strategies IT

WindRanger Governance to Snapshot-Strategies integration test suite.

Initialises an in-memory node with the Governance and MultiCall contracts, populated with test data and verifies the correctness of the WindRanger Snapshot-Strategies.

## Development

Development follows these processes outlined in [development process](DEVELOPMENT_PROCESS.md)

## Installation, building and running

Git clone, then from the project root execute

### Install

To retrieve the project dependencies and before any further tasks will run correctly

```shell
npm install
```

### Husky Git Commit Hooks

To enable Husky commit hooks to trigger the lint-staged behaviour of formatting and linting the staged files prior
before committing, prepare your repo with `prepare`.

```shell
npm run prepare
```

### Build and Test

```shell
npm run build
npm test
```

If you make changes that don't get picked up then add a clean into the process

```shell
npm run clean
npm run build
npm test
```

## Logging

Logging is performed with Bunyan

### Bunyan CL

To have the JSON logging output into a more human-readable form, pipe the stdout to the Bunyan CLI tool.

```shell
npx hardhat accounts | npx bunyan
```

## Local Node Setup

Separate to the integration tests, you can set up a local HardHat node instance with contracts and test data using scripts.

The motivation for setting up a local HardHat node would be to run separate tests against it.

```shell
npx hardhat node

npx hardhat run ./scripts/deploy-all.ts --network local
```

In the script ensure that `votesOracleAddress` (WindRanger Votes Oracle) matches the deployed contract address, then to validate the setup:

```shell
npx hardhat run ./scripts/vote-by-role.ts --network local
```

```shell
npx hardhat run ./scripts/vote-open.ts --network local
```
