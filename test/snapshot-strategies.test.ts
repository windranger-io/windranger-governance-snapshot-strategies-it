// Start - Support direct Mocha run & debug
import 'hardhat'
import '@nomiclabs/hardhat-ethers'
// End - Support direct Mocha run & debug

import fs from 'fs'
import chai, {expect} from 'chai'
import {ethers} from 'hardhat'
import {before} from 'mocha'
import {solidity} from 'ethereum-waffle'
import {
  BitToken,
  Multicall,
  TimelockController,
  WindRangerGovernance
} from '../typechain'
import {BigNumber} from 'ethers'
import {Example, callGetScores} from './snapshot/index.spec'
import * as Assert from 'assert'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'

// Wires up Waffle with Chai
chai.use(solidity)

describe('Test Strategy Role Voting', () => {
  before(async () => {
    multiCall = await deployMultiCall()
    writeNetworksJson(multiCall)
    admin = await signer(0)
    token = await deployToken(admin.address)
    timeLock = await deployTimeLock(admin.address)
    governance = await deployGovernance(token, timeLock)

    //TODO chage to the voting contract after lastest Gov update
    roleVotingExample = await exampleJson(
      'bitdao-vote-by-role',
      governance.address
    )

    const delegatedVotes = BigNumber.from(6601234567890123456780n)
    await governance.setVotingPowerSingleAdmin(admin.address, delegatedVotes)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let scores: ArrayLike<any>
  let admin: SignerWithAddress
  let token: BitToken
  let timeLock: TimelockController
  let governance: WindRangerGovernance
  let multiCall: Multicall
  let roleVotingExample: Example
})

async function signer(index: number): Promise<SignerWithAddress> {
  const signers = await ethers.getSigners()
  expect(signers.length).is.greaterThan(index)
  return signers[index]
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

async function deployMultiCall(): Promise<Multicall> {
  const factory = await ethers.getContractFactory('Multicall')
  const multi = <Multicall>await factory.deploy()
  return multi.deployed()
}

async function exampleJson(
  strategy: string,
  votingContract: string
): Promise<Example> {
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

//TODO use the correct chain id
//TODO grab the id from the example
function writeNetworksJson(contract: Multicall): void {
  const jsonFile = './node_modules/@snapshot-labs/snapshot.js/src/networks.json'
  const networks = {
    '1': {
      key: '1',
      chainId: 33133,
      multicall: contract.address
    }
  }

  try {
    const data = JSON.stringify(networks, null, 4)
    fs.writeFileSync(jsonFile, data, 'utf8')
  } catch (err) {
    Assert.fail(`Error writing file: ${err}`)
  }
}
