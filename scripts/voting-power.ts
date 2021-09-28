import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {BigNumber, Contract} from 'ethers'

const erc20Abi = [
  'function balanceOf(address account) external view returns (uint256)'
]
const governanceAbi = [
  'function getVotes(address account, bytes32 role) public view returns (uint256)',
  'function setVotingPowerSingleAdmin(address voter, uint256 votingPower) external',
  'function delegate(bytes32 role, uint256 votes, address delegatee) external'
]

const erc20Address = '0x959922be3caee4b8cd9a407cc3ac1c251c2007b1'
const governanceAddress = '0x68b1d87f95878fe05b998f19b66f4baba5de1aed'

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

  const balance = await erc20.balanceOf(admin.address)

  log.info('%s has balanceOf %s', admin.address, balance)

  logVotes(governance, admin.address, treasuryRole)

  const delegatedVotes = BigNumber.from(556632)

  await governance.delegate(treasuryRole, delegatedVotes, admin.address)

  logVotes(governance, admin.address, treasuryRole)
}

async function logVotes(
  governance: Contract,
  adminAddress: string,
  role: string
) {
  const votingPower = await governance.getVotes(adminAddress, role)
  log.info('%s role: %s, votes: %s', adminAddress, role, votingPower)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
