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

// Wires up Waffle with Chai
chai.use(solidity)

//TODO changes to snapshot.js on node_modules - need npm post install patch

const roleVotingExample = loadExampleJson('bitdao-vote-by-role')
//const roleVotingExample = loadExampleJson('erc20-balance-of')

describe('Test Strategy Role Voting', () => {
  before(async () => {
    multiCall = await deployMultiCall()
    writeNetworksJson(multiCall)
    admin = await signer(0)
    token = await deployToken(admin)
    timeLock = await deployTimeLock(admin)
    governance = await deployGovernance(token, timeLock)
    const delegatedVotes = BigNumber.from(6601234567890123456780n)
    await governance.setVotingPowerSingleAdmin(admin, delegatedVotes)
  })

  it('Strategy should run without any errors', async () => {
    scores = await callGetScores(roleVotingExample)
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
  let admin: string
  let token: BitToken
  let timeLock: TimelockController
  let governance: WindRangerGovernance
  let multiCall: Multicall
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

async function deployMultiCall(): Promise<Multicall> {
  const factory = await ethers.getContractFactory('Multicall')
  const multi = <Multicall>await factory.deploy()
  return multi.deployed()
}

function loadExampleJson(strategy: string): Example {
  const jsonFile =
    './node_modules/windranger-snapshot/dist/strategies/' +
    strategy +
    '/examples.json'
  try {
    const data = fs.readFileSync(jsonFile, 'utf8')

    const json = JSON.parse(data)
    Assert.ok(
      json.length == 1,
      'Expecting Example to be an array of length one'
    )

    //TODO temp - replace with commented out code
    const ex = json[0]
    ex.snapshot = 5
    return ex

    return json[0] as Example
  } catch (error) {
    Assert.fail('Unable to load the example JSON: ' + jsonFile + '; ' + error)
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
