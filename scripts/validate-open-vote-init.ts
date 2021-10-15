import {ethers} from 'hardhat'
import {log} from '../config/logging'

const openVotingAbi = [
  'function getVotes(address account) public view returns (uint256)',
  'function setOpenVotingPower(address account, uint256 votingPower) external'
]

const votesOracleAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
const openVotePower = 100500600n

async function main() {
  const signers = await ethers.getSigners()
  const admin = signers[0]

  const votesOracle = new ethers.Contract(
    votesOracleAddress,
    openVotingAbi,
    admin
  )

  await votesOracle.setOpenVotingPower(admin.address, openVotePower)

  const votingPower = await votesOracle.getVotes(admin.address)
  log.info('%s without role, votes: %s', admin.address, votingPower)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
