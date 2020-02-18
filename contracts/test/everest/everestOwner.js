const Everest = artifacts.require('Everest.sol')
const Token = artifacts.require('Dai.sol')
const helpers = require('../helpers.js')
const utils = require('../utils.js')

contract('Everest', accounts => {
    const newMemberWallet = utils.wallets.nine() // throw away wallet
    const ownerWallet = utils.wallets.one()
    const registryOwnerWallet = utils.wallets.zero()
    const registryOwnerAddress = registryOwnerWallet.signingKey.address

    describe('Everest owner functionality. Functions: withdraw(), updateCharter()', () => {
        it('should allow owner to update the charter', async () => {
            const everest = await Everest.deployed()
            const newCharter = '0x0123456789012345678901234567890123456789012345678901234567891111'
            await everest.updateCharter(newCharter, { from: registryOwnerAddress })
            const updatedCharter = await everest.charter()
            assert.equal(updatedCharter, newCharter, 'Charter was not updated')
        })

        it('should allow owner to withdraw DAI from reserve bank', async () => {
            // Apply one member so the reserve bank has 10 DAI
            await helpers.applySignedWithAttribute(newMemberWallet, ownerWallet)

            const everest = await Everest.deployed()
            const token = await Token.deployed()
            const reserveBankAddress = await everest.reserveBank()

            const bankOwnerBalanceStart = await token.balanceOf(registryOwnerAddress)
            const reserveBankBalanceStart = await token.balanceOf(reserveBankAddress)

            await everest.withdraw(registryOwnerAddress, utils.applyFeeBN, {
                from: registryOwnerAddress
            })

            const bankOwnerBalanceEnd = await token.balanceOf(registryOwnerAddress)
            const reserveBankBalanceEnd = await token.balanceOf(reserveBankAddress)

            assert.equal(
                bankOwnerBalanceEnd.toString(),
                bankOwnerBalanceStart.add(utils.applyFeeBN).toString(),
                'Owner did not withdraw application fee'
            )
            assert.equal(
                reserveBankBalanceEnd.toString(),
                reserveBankBalanceStart.sub(utils.applyFeeBN).toString(),
                'Reserve bank did not withdraw funds'
            )
        })
    })
})
