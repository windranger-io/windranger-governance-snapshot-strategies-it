import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {deployBitDao} from './deploy'

async function main() {
  await run('compile')

  const signers = await ethers.getSigners()
  const admin = signers[0].address
  const receipt = await deployBitDao(admin)

  log.info('Deployed ERC20 contract, receipt: %s', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
