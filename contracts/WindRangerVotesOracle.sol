// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import 'windranger-governance/contracts/VotesOracle.sol';

/**
 * @title A wrapping contract to get a contract in node_module compiled by HardHat.
 */
contract WindRangerVotesOracle is VotesOracle {
  constructor() {}
}
