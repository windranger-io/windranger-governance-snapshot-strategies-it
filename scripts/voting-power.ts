import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {BigNumber} from 'ethers'

const erc20Abi = [
  'function balanceOf(address account) external view returns (uint256)',
  'function getCurrentVotes(address account) external view returns (uint256)',
  'function balanceOfAt(address account, uint256 snapshotId) public view returns (uint256)',
  'function snapshot() external returns (uint256)'
]
const governanceAbi = [
  'function setVotingPower() external',
  'function getVotes(address account, bytes32 role) public view returns (uint256)',
  'function setVotingPowerSingleAdmin(address voter, uint256 votingPower) external',
  'function delegate(bytes32 role, uint256 votes, address delegatee) external',
  'function setVotingPowerSingleAdmin(address voter, uint256 votingPower)'
]

const erc20Address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const governanceAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'

const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

async function main() {
  await run('compile')

  const signers = await ethers.getSigners()
  const admin = signers[0]

  const erc20 = new ethers.Contract(erc20Address, erc20Abi, admin)

  const governance = new ethers.Contract(
    governanceAddress,
    governanceAbi,
    admin
  )

  // Create a snapshot or the BitDao voting power returns zero irrespective of balance
  //  await erc20.snapshot()

  const balance = await erc20.balanceOf(admin.address)
  log.info('%s has token balance of %s', admin.address, balance)

  /*
  const balanceOfAt = await erc20.balanceOfAt(admin.address, 1)
  log.info(
    '%s at snapshot zero has token balance of %s',
    admin.address,
    balanceOfAt
  )

  const tokenVotes = await erc20.getCurrentVotes(admin.address)
  log.info('%s has token votes of %s', admin.address, tokenVotes)
*/

  const votingPower = await governance.getVotes(admin.address, treasuryRole)
  log.info('%s role: %s, votes: %s', admin.address, treasuryRole, votingPower)

  const delegatedVotes = BigNumber.from(6601234567890123456780n)

  // Relies on BitDAO current votes, which don't seem to get set
  // await governance.setVotingPower()

  // Fails as there is no voting power to delegate yet
  // await governance.delegate(treasuryRole, delegatedVotes, admin.address)

  await governance.setVotingPowerSingleAdmin(admin.address, delegatedVotes)

  const votingPowerAfter = await governance.getVotes(
    admin.address,
    treasuryRole
  )
  log.info(
    '%s role: %s, votes: %s',
    admin.address,
    treasuryRole,
    votingPowerAfter
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
