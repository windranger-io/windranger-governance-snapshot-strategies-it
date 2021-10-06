import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {BigNumber} from 'ethers'

const erc20Abi = [
  'function balanceOf(address account) external view returns (uint256)'
]
const roleVotingAbi = [
  'function setVotingPowerSingleAdmin(address voter, uint256 votingPower) external',
  'function getVotes(address account, bytes32 role) external view returns (uint256)'
]

const erc20Address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const governanceAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'

const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

async function main() {
  const signers = await ethers.getSigners()
  const admin = signers[0]

  const erc20 = new ethers.Contract(erc20Address, erc20Abi, admin)

  const governance = new ethers.Contract(
    governanceAddress,
    roleVotingAbi,
    admin
  )

  const balance = await erc20.balanceOf(admin.address)
  log.info('%s has token balance of %s', admin.address, balance)

  const votingPower = await governance.getVotes(admin.address, treasuryRole)
  log.info('%s role: %s, votes: %s', admin.address, treasuryRole, votingPower)

  // setVotingPower reverts if already called :. only call if power not already set.
  if (votingPower == 0) {
    const delegatedVotes = BigNumber.from(6601234567890123456780n)
    log.info('Setting the voting power: %s', delegatedVotes)
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
