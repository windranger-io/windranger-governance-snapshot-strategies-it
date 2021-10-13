// Start - Support direct Mocha run & debug
import 'hardhat'
import '@nomiclabs/hardhat-ethers'
// End - Support direct Mocha run & debug

import Assert from 'assert'
import {Multicall} from '../../typechain'
import fs from 'fs'
import {ethers} from 'hardhat'
import {log} from '../../config/logging'

placeholderNetworksJson()

/*
function sleep(milliseconds: number) {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

let count = 4
while (!proceed && count > 0) {
  log.info('sleep')
  sleep(1000)
  count--
}
*/
export async function setupMultiCallContract(): Promise<void> {
  try {
    const multiCall = await deployMultiCall()
    writeNetworksJson(multiCall)
  } catch (error) {
    Assert.fail(
      `Error creating test file to use as Snapshot.js networks.json: ${error}`
    )
  }
}

/**
 * Guessing the vaules for the top level init of Snapshot.js
 */
function placeholderNetworksJson(): void {
  const jsonFile = './networks.temp.json'
  const networks = {
    '1': {
      key: '1',
      chainId: 33133,
      multicall: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }
  }

  try {
    const data = JSON.stringify(networks, null, 4)
    fs.writeFileSync(jsonFile, data, 'utf8')
  } catch (err) {
    Assert.fail(`Error writing file: ${err}`)
  }
}

//TODO check the existing contexts - ensure they match, chainId, multicall address
//TODO use the correct chain id
//TODO grab the id from the example
function writeNetworksJson(contract: Multicall): void {
  const jsonFile = './networks.temp.json'
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

async function deployMultiCall(): Promise<Multicall> {
  const factory = await ethers.getContractFactory('Multicall')
  const multi = <Multicall>await factory.deploy()
  return multi.deployed()
}
