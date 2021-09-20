import {run, ethers} from 'hardhat'
import {log} from '../config/logging'

async function main() {
  await run('compile')

  const Multicall = await ethers.getContractFactory('Multicall')
  const aggregate = await Multicall.deploy()

  log.info('Deployed Multicall contract @ %s', aggregate.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
