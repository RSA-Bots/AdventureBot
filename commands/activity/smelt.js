/**
 * a;cook <fuel> [fuelAmount=1] <object> [objectAmount=1]
 * 
 * check if user has fuel
 * if fuelAmount then check if user has fuelAmount
 * check if user has object
 * if objectAmount then check if user has objectAmount
 * 
 * check if object has valid recipe
 * 
 * smelt
 * 
 * a;cook wood 1 wood 4
 */

const dataHelper = require('../../util/dataHelper');

module.exports = {
    name: 'smelt',
    description: 'Smelt things',
    guildOnly: true,
    cooldown: 30,
    async execute(message, args) {
        let userId = message.author.id;
        let account = await dataHelper.getAccount(userId);

        /** a;smelt <fuel> [fuelAmount = 1] <object> [objectAmount = 1] */
        let fuelItemQuery = args[0];
        let fuelAmount = 1;
        let fuelSlice = 2;
        if (parseInt(args[1])) {
            fuelAmount = parseInt(args[1]);
        } else {
            fuelSlice = 1;
        }
        let smeltItemQuery = args[fuelSlice];
        let smeltItemAmount = 1;
        if (parseInt(args[fuelSlice+1])) {
            smeltItemAmount = parseInt[args[fuelSlice+1]];
        }

        let fuelItem = dataHelper.getItem(fuelItemQuery);
        let smeltItem = dataHelper.getItem(smeltItemQuery);

        if (!fuelItem) { return message.channel.send('That specified fuel item does not exist.'); }
        if (!smeltItem) { return message.channel.send('That specified smelt item does not exist.'); }

        if (fuelItem.localized === smeltItem.localized) {
            //check that user has enough of item for both actions
            let userAmount = account.inventory[0][fuelItem.localized]['amount'];
            let total = fuelAmount + smeltItemAmount;

            if (userAmount < total) { return message.channel.send(`You do not have enough ${fuelItem.name} to perform this action.`); }
        }

        let smeltTime = dataHelper.getFuel(fuelItem.localized);
        
        if (smeltTime == 0) { return message.channel.send(`${fuelItem.name} can not be used as fuel.`); }
        
        let userFuelAmount = account.inventory[0][fuelItem.localized]['amount'];

        if (userFuelAmount < fuelAmount) { return message.channel.send(`You do not have ${fuelAmount} ${fuelItem.name}`); }

        smeltTime = smeltTime * fuelAmount;

        if (!smeltItem.smeltable) { return message.channel.send(`${smeltItem.name} can not be smelted.`); }

        let userSmeltAmount = account.inventory[0][smeltItem.localized]['amount'];

        if (userSmeltAmount < smeltItemAmount) { return message.channel.send(`You do not have ${smeltItemAmount} ${smeltItem.name}`); }

        let requiredSmeltTime = smeltItem.smeltCost * smeltItemAmount;

        if (smeltTime < requiredSmeltTime) { return message.channel.send(`You do not have enough ${fuelItem.name} to smelt ${smeltItemAmount} ${smeltItem.name}`); }

        let smeltResultQuery = smeltItem.smeltResult;
        let smeltResult = dataHelper.getItem(smeltResultQuery);

        if (!smeltResult) { return message.channel.send(`The smelt result for ${smeltItem.name} has not been defined. **Your items have not been used.**`); }

        let smeltResultAmount = smeltItem.smeltResultAmount;

        if (smeltResultAmount == 0) { return message.channel.send(`The smelt result amount for ${smeltItem.name} has not been defined. **Your items have not been used.**`); }

        let userSmeltResultAmount = account.inventory[0][smeltResult.localized]['amount'];

        smeltResultAmount = smeltResultAmount + userSmeltResultAmount;

        await dataHelper.updateItemForAccount(account, fuelItem.localized, userFuelAmount-fuelAmount);
        await dataHelper.updateItemForAccount(account, smeltItem.localized, userSmeltAmount-smeltItemAmount);
        await dataHelper.updateItemForAccount(account, smeltResult.localized, smeltResultAmount);
        
        return message.channel.send(`Successfully smelted ${smeltItemAmount} ${smeltItem.name} using ${fuelAmount} ${fuelItem.name}. You gained ${smeltResultAmount} ${smeltResult.name}!`);
    }
}