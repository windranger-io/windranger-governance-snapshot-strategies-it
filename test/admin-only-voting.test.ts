// Start - Support direct Mocha run & debug
import 'hardhat'
import '@nomiclabs/hardhat-ethers'
// End - Support direct Mocha run & debug

import chai, {expect} from 'chai'
import {ethers} from 'hardhat'
import {before} from 'mocha'
import {solidity} from 'ethereum-waffle'
import {BitToken, TimelockController, WindRangerGovernance} from '../typechain'
import {getAddress} from 'ethers/lib/utils'
import {BigNumber} from 'ethers'

// Wires up Waffle with Chai
chai.use(solidity)

const TEN_OCTILLIAN = 10000000000000000000000000000n
const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

describe('Single token holder (Admin)', () => {
  before(async () => {
    admin = await signer(0)
    token = await deployToken(admin)
    timeLock = await deployTimeLock(admin)
    governance = await deployGovernance(token, timeLock)
  })

  it('full power in an open vote', async () => {
    expect(await governance['getVotes(address)'](admin)).equals(TEN_OCTILLIAN)
  })

  it('assigned vote power in an role vote', async () => {
    const delegatedVotes = BigNumber.from(6601234567890123456780n)
    expect(
      await governance['getVotes(address,bytes32)'](admin, treasuryRole)
    ).equals(0n)

    await governance.setVotingPowerSingleAdmin(admin, delegatedVotes)

    expect(
      await governance['getVotes(address,bytes32)'](admin, treasuryRole)
    ).equals(delegatedVotes)
  })

  let admin: string
  let token: BitToken
  let timeLock: TimelockController
  let governance: WindRangerGovernance
})

async function signer(index: number): Promise<string> {
  const signers = await ethers.getSigners()
  expect(signers.length).is.greaterThan(index)
  return signers[index].address
}

async function deployToken(creatorAddress: string): Promise<BitToken> {
  const factory = await ethers.getContractFactory('BitDAO')
  const dao = <BitToken>await factory.deploy(creatorAddress)
  return dao.deployed()
}

async function deployTimeLock(
  creatorAddress: string
): Promise<TimelockController> {
  const factory = await ethers.getContractFactory('TimelockController')
  const lock = <TimelockController>(
    await factory.deploy(1, [creatorAddress], [creatorAddress])
  )
  return lock.deployed()
}

async function deployGovernance(
  token: BitToken,
  timeLock: TimelockController
): Promise<WindRangerGovernance> {
  const factory = await ethers.getContractFactory('WindRangerGovernance')
  const governance = <WindRangerGovernance>(
    await factory.deploy(token.address, timeLock.address)
  )
  return governance.deployed()
}
