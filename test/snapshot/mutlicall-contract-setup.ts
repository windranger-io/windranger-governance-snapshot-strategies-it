// Start - Support direct Mocha run & debug
import 'hardhat'
import '@nomiclabs/hardhat-ethers'
// End - Support direct Mocha run & debug

import Assert from 'assert'
import {Multicall} from '../../typechain'
import fs from 'fs'
import {ethers} from 'hardhat'

// Snapshot networks.json must be written before snapshot.js.cis.js top level
writeNetworksJson()

/**
 * Installs the Multicall contract used by Snapshot.js to connect to the HardHat
 * in-memory chain.
 * Validates the networks init file passed in, failing if the Multicall address
 * does not match the init file, with suitable message.
 */
export async function multiCallForSnapshot(): Promise<void> {
  try {
    const multiCall = await deployMultiCall()
    writeDynamicNetworksJson(multiCall)
  } catch (error) {
    Assert.fail(
      `Error creating test file to use as Snapshot.js networks.json: ${error}`
    )
  }
}

/**
 * Guessing the vaules for the top level init of Snapshot.js
 */
function writeNetworksJson(): void {
  const jsonFile = './snapshot.networks.json'
  const networks = {
    '1': {
      key: '1',
      chainId: 33133,
      multicall: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
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
function writeDynamicNetworksJson(contract: Multicall): void {
  const jsonFile = './snapshot.networks.json'
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
