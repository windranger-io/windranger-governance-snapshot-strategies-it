import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {deployGovernance, deployTimeLockController} from './deploy'

async function main() {
  await run('compile')

  const signers = await ethers.getSigners()
  const admin = signers[0]

  const erc20 = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  const timeLockReceipt = await deployTimeLockController(admin.address)

  log.info('Deployed Governance contract, receipt: %s', timeLockReceipt)

  const governanceReceipt = await deployGovernance(
    erc20,
    timeLockReceipt.contractAddress
  )

  log.info('Deployed Governance contract, receipt: %s', governanceReceipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
