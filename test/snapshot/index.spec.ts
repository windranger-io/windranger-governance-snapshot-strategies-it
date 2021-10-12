import hre from 'hardhat'
import {ethers} from 'hardhat'
import snapshot from 'windranger-snapshot'
import {log} from '../../config/logging'
import {expect} from 'chai'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'

export interface Example {
  network: string
  strategy: string
  addresses: string[]
  snapshot: number
  rpc: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callGetScores(example: Example): Promise<ArrayLike<any>> {
  return await snapshot.utils.getScoresDirect(
    'yam.eth',
    [example.strategy],
    example.network,
    await signer(0),
    example.addresses,
    example.snapshot
  )
}

async function signer(index: number): Promise<SignerWithAddress> {
  const signers = await ethers.getSigners()
  expect(signers.length).is.greaterThan(index)
  return signers[index]
}
