
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract WrappedToken is OwnableUpgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable {

    function initialize(address bridgeContract, string calldata name, string calldata symbol) external initializer {
        _transferOwnership(bridgeContract);
        __ERC20_init(name, symbol);
    }

    function mint(address account, uint amount) external onlyOwner {
        _mint(account, amount);
    }
}