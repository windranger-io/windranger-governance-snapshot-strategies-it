import {ethers} from 'hardhat'
import {log} from '../config/logging'
import {BigNumber} from 'ethers'

const roleVotingAbi = [
  'function setRolesVotingPower(address account, bytes32[] calldata roles, uint256[] calldata votingPowers) external',
  'function getVotes(address account, bytes32 role) external view returns (uint256)'
]
const votesAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

async function main() {
  const signers = await ethers.getSigners()
  const admin = signers[0]

  const votesOracle = new ethers.Contract(votesAddress, roleVotingAbi, admin)

  const votingPower = await votesOracle.getVotes(admin.address, treasuryRole)
  log.info('%s role: %s, votes: %s', admin.address, treasuryRole, votingPower)

  // setVotingPower reverts if already called :. only call if power not already set.
  if (votingPower == 0) {
    const roleVotePower = BigNumber.from(6601234567890123456780n)
    log.info('Setting the voting power: %s', roleVotePower)
    await votesOracle.setRolesVotingPower(
      admin.address,
      [treasuryRole],
      [roleVotePower]
    )

    const votingPowerAfter = await votesOracle.getVotes(
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
