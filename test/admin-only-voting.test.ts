// Start - Support direct Mocha run & debug
import 'hardhat'
import '@nomiclabs/hardhat-ethers'
// End - Support direct Mocha run & debug

import chai, {expect} from 'chai'
import {ethers} from 'hardhat'
import {before} from 'mocha'
import {solidity} from 'ethereum-waffle'
import {
  deployGovernance,
  deployTimeLock,
  deployToken,
  signer
} from './contracts'
import {BitToken, TimelockController, WindRangerGovernance} from '../typechain'
import {BigNumber} from 'ethers'

// Wires up Waffle with Chai
chai.use(solidity)

const tenOctillian = 10000000000000000000000000000n
const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

describe('Single token holder (Admin)', () => {
  before(async () => {
    admin = (await signer(0)).address
    token = await deployToken(admin)
    timeLock = await deployTimeLock(admin)
    governance = await deployGovernance(token, timeLock)
  })

  it('full power in an open vote', async () => {
    expect(await governance['getVotes(address)'](admin)).equals(tenOctillian)
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
