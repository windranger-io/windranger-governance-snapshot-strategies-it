import {run, ethers} from 'hardhat'
import {log} from '../config/logging'
import {Contract} from 'ethers'

const erc20Abi = [
  'function balanceOf(address account) external view returns (uint256)'
]
const governanceAbi = [
  'function getVotes(address account, bytes32 role) public view returns (uint256)',
  'function delegate(bytes32 role, uint256 votes, address delegatee) external',
  'function registerNewRole(bytes32 role) external'
]

const erc20Address = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
const governanceAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
const roleTitle = 'busy body'

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

  const role = ethers.utils.formatBytes32String(roleTitle)

  //TODO uncertain how to send this transaction as the governance contract
  governance.registerNewRole(role)

  logVotes(governance, admin.address, role)

  const delegatedVotes = 556632
  await governance.delegate(role, delegatedVotes, admin.address)

  logVotes(governance, admin.address, role)
}

async function logVotes(
  governance: Contract,
  adminAddress: string,
  role: string
) {
  const votingPower = await governance.getVotes(adminAddress, role)
  log.info('%s starting votes: %s', adminAddress, votingPower)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    log.error(error)
    process.exit(1)
  })
