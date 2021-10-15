import {run} from 'hardhat'
import {log} from '../config/logging'
import {deployMultiCall} from './deploy'

async function main() {
  await run('compile')

  const receipt = await deployMultiCall()

  log.info('Deployed Multicall contract, receipt: %s', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
