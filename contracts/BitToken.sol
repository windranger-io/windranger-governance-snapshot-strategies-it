// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.6.5 <0.8.0;

import 'bitdao-token-contract/contracts/BitDAO.sol';

/**
 * @title A wrapping contract to get a contract in node_module compiled by HardHar.
 */
contract BitToken is BitDAO {
  constructor(address _admin) BitDAO(_admin) {}
}
