/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabCar = require('./lib/chaincode-js-contract');

module.exports.FabCar = FabCar;
module.exports.contracts = [FabCar];