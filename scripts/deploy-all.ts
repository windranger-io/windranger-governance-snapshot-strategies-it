import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {
  deployBitDao,
  deployMulticall,
  deployGovernance,
  deployTimeLockController
} from './deploy'

async function main() {
  await run('compile')

  const signers = await ethers.getSigners()
  const admin = signers[0].address

  const bitDaoReceipt = await deployBitDao(admin)
  const bitDaoAddress = bitDaoReceipt.contractAddress
  log.info('BitDAO @ %s', bitDaoAddress)

  const timelockReceipt = await deployTimeLockController(admin)
  const timelockAddress = timelockReceipt.contractAddress
  log.info('Timelock @ %s', timelockAddress)

  const governanceReceipt = await deployGovernance(
    bitDaoAddress,
    timelockAddress
  )
  const governanceAddress = governanceReceipt.contractAddress
  log.info('Governance @ %s', governanceAddress)

  const multicallReceipt = await deployMulticall()
  const multicallAddress = multicallReceipt.contractAddress

  log.info('Multicall @ %s', multicallAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
