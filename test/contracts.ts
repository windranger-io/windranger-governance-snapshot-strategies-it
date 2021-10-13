import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'
import {ethers} from 'hardhat'
import {expect} from 'chai'
import {
  BitToken,
  Multicall,
  TimelockController,
  WindRangerGovernance
} from '../typechain'

export async function signer(index: number): Promise<SignerWithAddress> {
  const signers = await ethers.getSigners()
  expect(signers.length).is.greaterThan(index)
  return signers[index]
}

export async function deployToken(creatorAddress: string): Promise<BitToken> {
  const factory = await ethers.getContractFactory('BitDAO')
  const dao = <BitToken>await factory.deploy(creatorAddress)
  return dao.deployed()
}

export async function deployTimeLock(
  creatorAddress: string
): Promise<TimelockController> {
  const factory = await ethers.getContractFactory('TimelockController')
  const lock = <TimelockController>(
    await factory.deploy(1, [creatorAddress], [creatorAddress])
  )
  return lock.deployed()
}

export async function deployGovernance(
  token: BitToken,
  timeLock: TimelockController
): Promise<WindRangerGovernance> {
  const factory = await ethers.getContractFactory('WindRangerGovernance')
  const governance = <WindRangerGovernance>(
    await factory.deploy(token.address, timeLock.address)
  )
  return governance.deployed()
}

export async function deployMultiCall(): Promise<Multicall> {
  const factory = await ethers.getContractFactory('Multicall')
  const multi = <Multicall>await factory.deploy()
  return multi.deployed()
}
