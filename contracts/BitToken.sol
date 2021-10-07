// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.6.5 <0.8.0;

import 'bitdao-token-contract/contracts/BitDAO.sol';

/**
 * @title Voting open to all members.
 * @notice Retrieve the voting power for an account, at this moment in time.
 * @dev Used by the off-chain Snpashot voting strategy bitdao-vote
 */
contract BitToken is BitDAO {
  constructor(address _admin) BitDAO(_admin) {}
}
