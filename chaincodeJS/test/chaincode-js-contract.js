/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { ChaincodeJsContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('ChaincodeJsContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new ChaincodeJsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"chaincode js 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"chaincode js 1002 value"}'));
    });

    describe('#chaincodeJsExists', () => {

        it('should return true for a chaincode js', async () => {
            await contract.chaincodeJsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a chaincode js that does not exist', async () => {
            await contract.chaincodeJsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createChaincodeJs', () => {

        it('should create a chaincode js', async () => {
            await contract.createChaincodeJs(ctx, '1003', 'chaincode js 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"chaincode js 1003 value"}'));
        });

        it('should throw an error for a chaincode js that already exists', async () => {
            await contract.createChaincodeJs(ctx, '1001', 'myvalue').should.be.rejectedWith(/The chaincode js 1001 already exists/);
        });

    });

    describe('#readChaincodeJs', () => {

        it('should return a chaincode js', async () => {
            await contract.readChaincodeJs(ctx, '1001').should.eventually.deep.equal({ value: 'chaincode js 1001 value' });
        });

        it('should throw an error for a chaincode js that does not exist', async () => {
            await contract.readChaincodeJs(ctx, '1003').should.be.rejectedWith(/The chaincode js 1003 does not exist/);
        });

    });

    describe('#updateChaincodeJs', () => {

        it('should update a chaincode js', async () => {
            await contract.updateChaincodeJs(ctx, '1001', 'chaincode js 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"chaincode js 1001 new value"}'));
        });

        it('should throw an error for a chaincode js that does not exist', async () => {
            await contract.updateChaincodeJs(ctx, '1003', 'chaincode js 1003 new value').should.be.rejectedWith(/The chaincode js 1003 does not exist/);
        });

    });

    describe('#deleteChaincodeJs', () => {

        it('should delete a chaincode js', async () => {
            await contract.deleteChaincodeJs(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a chaincode js that does not exist', async () => {
            await contract.deleteChaincodeJs(ctx, '1003').should.be.rejectedWith(/The chaincode js 1003 does not exist/);
        });

    });

});