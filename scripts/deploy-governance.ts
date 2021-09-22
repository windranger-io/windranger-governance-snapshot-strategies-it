import {run, ethers} from 'hardhat'
import {log} from '../config/logging'

async function main() {
  await run('compile')

  const Governance = await ethers.getContractFactory('Governance')
  const signers = await ethers.getSigners()
  const admin = signers[0].address

  log.info('Admin @ %s', admin)
  const aggregate = await Governance.deploy(admin)

  log.info('Deployed Governance contract @ %s', aggregate.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
