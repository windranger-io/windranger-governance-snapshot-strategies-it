// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import 'windranger-governance/contracts/Governance.sol';

/**
 * @title A wrapping contract to get a contract in node_module compiled by HardHat.
 */
contract WindRangerGovernance is Governance {
  constructor(
    ISnapshotVoting token,
    TimelockController timeLock,
    address votesCalculator
  ) Governance(token, timeLock, votesCalculator) {}
}
