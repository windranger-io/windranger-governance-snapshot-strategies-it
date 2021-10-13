import snapshot from 'windranger-snapshot'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'

export interface StrategyExample {
  network: string
  strategy: unknown
  addresses: string[]
  snapshot: string
}

export async function callGetScores(
  example: StrategyExample,
  provider: SignerWithAddress
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ArrayLike<any>> {
  return await snapshot.utils.getScoresDirect(
    'yam.eth',
    [example.strategy],
    example.network,
    provider,
    example.addresses,
    example.snapshot
  )
}
