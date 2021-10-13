import {ethers} from 'hardhat'
import {log} from '../config/logging'

const erc20Abi = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getCurrentVotes(address account) external view returns (uint256)',
  'function balanceOfAt(address account, uint256 snapshotId) public view returns (uint256)',
  'function snapshot() external returns (uint256)'
]
const openVotingAbi = [
  'function getVotes(address account) external view returns (uint256)'
]

const erc20Address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const governanceAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'

async function main() {
  const signers = await ethers.getSigners()
  const admin = signers[0]

  const erc20 = new ethers.Contract(erc20Address, erc20Abi, admin)

  const governance = new ethers.Contract(
    governanceAddress,
    openVotingAbi,
    admin
  )

  // Create a snapshot or the BitDao voting power returns zero irrespective of balance
  //  await erc20.snapshot()

  const balance = await erc20.balanceOf(admin.address)
  log.info('%s has token balance of %s', admin.address, balance)

  const votingPower = await governance.getVotes(admin.address)
  log.info('%s without role, votes: %s', admin.address, votingPower)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
