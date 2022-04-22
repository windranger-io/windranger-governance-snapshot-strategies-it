import 'hardhat'

import Assert from 'assert'
import {Multicall} from '../../typechain-types'
import fs, {promises as fsPromises} from 'fs'
import {config} from 'hardhat'
import {expect} from 'chai'

// Snapshot networks.json must be written before snapshot.js.cis.js top level
writeNetworksJson()

/**
 * Guessing the vaules for the top level init of Snapshot.js
 */
function writeNetworksJson(): void {
  const jsonFile = './snapshot.networks.json'
  const networks = {
    '1': {
      key: '1',
      chainId: 33133,
      multicall: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
    }
  }

  try {
    const data = JSON.stringify(networks, null, 4)
    fs.writeFileSync(jsonFile, data, 'utf8')
  } catch (err) {
    Assert.fail(`Error writing file: ${err}`)
  }
}

/**
 * Validates the networks init file passed in and used by the init of Snapshot.js has the correct address and chain id for the multi call to work correctly,
 * failing with a suitable deep comparison message otherwise.
 */
export async function validateNetworksJson(contract: Multicall): Promise<void> {
  const jsonFile = './snapshot.networks.json'
  const expectedNetworks = {
    '1': {
      key: '1',
      chainId: config.networks.hardhat.chainId,
      multicall: contract.address
    }
  }

  const data = await fsPromises.readFile(jsonFile, 'utf8')
  const actualNetworks = JSON.parse(data)
  expect(actualNetworks).to.deep.equal(expectedNetworks)
}
