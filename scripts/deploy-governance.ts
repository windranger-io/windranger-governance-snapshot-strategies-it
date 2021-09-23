import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {deployGovernance} from './deploy'

async function main() {
  await run('compile')

  const erc20 = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  const receipt = await deployGovernance(erc20)

  log.info('Deployed Governance contract, receipt: %s', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
