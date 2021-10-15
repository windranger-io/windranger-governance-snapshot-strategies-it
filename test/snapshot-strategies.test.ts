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
  deployMultiCall,
  deployTimeLock,
  deployToken,
  signer,
  deployVotesOracle
} from './contracts'
import {
  BitToken,
  TimelockController,
  VotesOracle,
  WindRangerGovernance
} from '../typechain'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import './snapshot/networks-json'
import {StrategyExample, callGetScores} from './snapshot/index.spec'
import {validateNetworksJson} from './snapshot/networks-json'

// Wires up Waffle with Chai
chai.use(solidity)

const openVotePower = 100500900n
const roleVotePower = 6601234567890123456780n
const treasuryRole = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TREASURY_ROLE')
)

describe('Test Strategy', () => {
  before(async () => {
    const multiCall = await deployMultiCall()
    await validateNetworksJson(multiCall)
    admin = await signer(0)
    token = await deployToken(admin.address)
    timeLock = await deployTimeLock(admin.address)
    votes = await deployVotesOracle()
    governance = await deployGovernance(token, timeLock, votes)

    await votes.setOpenVotingPower(admin.address, openVotePower)
    await votes.setRolesVotingPower(
      admin.address,
      [treasuryRole],
      [roleVotePower]
    )
  })

  describe('bitdao-role-vote', () => {
    before(async () => {
      roleVotingExample = await roleVotingStrategyExample(
        'bitdao-role-vote',
        governance.address
      )
    })

    it('Strategy should run without any errors', async () => {
      scores = await callGetScores(roleVotingExample, admin)
    }).timeout(10000)

    it('Should return an array of object with addresses', () => {
      expect(Array.isArray(scores)).equals(true)
      expect(typeof scores[0]).equals('object')
      expect(Object.keys(scores[0]).length).greaterThanOrEqual(1)
      expect(
        Object.keys(scores[0]).some((address) =>
          roleVotingExample.addresses
            .map((v) => v.toLowerCase())
            .includes(address.toLowerCase())
        )
      ).equals(true)
      // Check if all scores are numbers
      expect(
        Object.values(scores[0]).every((val) => typeof val === 'number')
      ).equals(true)
    })

    it('File examples.json should include at least 1 address with a positive score', () => {
      expect(
        Object.values(scores[0]).some((score) => (score as number) > 0)
      ).equals(true)
    })
  })

  describe('bitdao-open-vote', () => {
    before(async () => {
      openVotingExample = await openVotingStrategyExample(
        'bitdao-open-vote',
        governance.address
      )
    })

    it('Strategy should run without any errors', async () => {
      scores = await callGetScores(openVotingExample, admin)
    }).timeout(10000)

    it('Should return an array of object with addresses', () => {
      expect(Array.isArray(scores)).equals(true)
      expect(typeof scores[0]).equals('object')
      expect(Object.keys(scores[0]).length).greaterThanOrEqual(1)
      expect(
        Object.keys(scores[0]).some((address) =>
          openVotingExample.addresses
            .map((v) => v.toLowerCase())
            .includes(address.toLowerCase())
        )
      ).equals(true)
      // Check if all scores are numbers
      expect(
        Object.values(scores[0]).every((val) => typeof val === 'number')
      ).equals(true)
    })

    it('File examples.json should include at least 1 address with a positive score', () => {
      expect(
        Object.values(scores[0]).some((score) => (score as number) > 0)
      ).equals(true)
    })
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let scores: ArrayLike<any>
  let admin: SignerWithAddress
  let token: BitToken
  let timeLock: TimelockController
  let votes: VotesOracle
  let governance: WindRangerGovernance
  let openVotingExample: StrategyExample
  let roleVotingExample: StrategyExample
})

async function roleVotingStrategyExample(
  strategy: string,
  votingContract: string
): Promise<StrategyExample> {
  const signers = await ethers.getSigners()

  return {
    network: '1',
    strategy: {
      name: strategy,
      params: {
        address: votingContract,
        symbol: 'BIT',
        decimals: 18,
        role: 'TREASURY_ROLE'
      }
    },
    addresses: signers.map((signer: SignerWithAddress) => signer.address),
    snapshot: 'latest'
  }
}

async function openVotingStrategyExample(
  strategy: string,
  votingContract: string
): Promise<StrategyExample> {
  const signers = await ethers.getSigners()

  return {
    network: '1',
    strategy: {
      name: strategy,
      params: {
        address: votingContract,
        symbol: 'BIT',
        decimals: 18
      }
    },
    addresses: signers.map((signer: SignerWithAddress) => signer.address),
    snapshot: 'latest'
  }
}
