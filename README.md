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

### Bunyan CLI

To have the JSON logging output into a more human-readable form, pipe the stdout to the Bunyan CLI tool.

```shell
npx hardhat accounts | npx bunyan
```

## Local Node Setup - No longer works, script need updating

After the project is built (with Solidity abis and binaries generated), you can set up a local HardHat node with contracts and test data using scripts.

```shell
npx hardhat node

npx hardhat run ./scripts/deploy-all.ts --network local
```

Ensure the `erc20Address` (BitDAO) and `governanceAddress` match the deployed contract addresses, then to validate the set up:

```shell
npx hardhat run ./scripts/vote-by-role.ts --network local
```

```shell
npx hardhat run ./scripts/vote-open.ts --network local
```
