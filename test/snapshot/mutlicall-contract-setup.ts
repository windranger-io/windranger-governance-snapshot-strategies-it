import 'hardhat'

import Assert from 'assert'
import {Multicall} from '../../typechain'
import fs from 'fs'
import {config, ethers} from 'hardhat'
import {expect} from 'chai'

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
    validateNetworksJson(multiCall)
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

//TODO improve the error message when objects don't deep equals
function validateNetworksJson(contract: Multicall): void {
  const jsonFile = './snapshot.networks.json'
  const expectedNetworks = {
    '1': {
      key: '1',
      chainId: config.networks.hardhat.chainId,
      multicall: contract.address
    }
  }

  const data = fs.readFileSync(jsonFile, 'utf8')
  const actualNetworks = JSON.parse(data)
  expect(actualNetworks).to.deep.equal(expectedNetworks)
}

async function deployMultiCall(): Promise<Multicall> {
  const factory = await ethers.getContractFactory('Multicall')
  const multi = <Multicall>await factory.deploy()
  return multi.deployed()
}
