const helper = require('../../util/helper');
const dataHelper = require('../../util/dataHelper');

module.exports = {
    name: 'pay',
    description: 'Pay a user from your balance',
    guildOnly: true,
    args: true,
    cooldown: 15,
    async execute(message, args) {
        let money = helper.getMoneyEmoji(message, 'tix');

        if (args.length < 2) { return message.channel.send('Not enough arguments provided.'); }

        let payer = message.author;
        let payee = await helper.queryMember(message, args);
        let amount = parseInt(args[1]);

        if (!payee) { return message.channel.send('The was no valid target to send money to.'); }
        if (payer.id === payee.id) { return message.channel.send(`It is pointless to exchange money with yourself.`); }
        if (isNaN(amount)) { return message.channel.send(`We send ${money}, not malformed numbers.`); }
        if (amount < 0) { return message.channel.send('Can not send negative money.'); }
        if (amount == 0) { return message.channel.send('No money to send'); }

        let payerAccount = await dataHelper.getAccount(payer.id);
        let payeeAccount = await dataHelper.getAccount(payee.id);

        let payerBalance = payerAccount.wallet[0].tix.amount;
        let payeeBalance = payeeAccount.wallet[0].tix.amount;

        if (payerBalance < amount) { return message.channel.send(`You need ${amount-payerBalance} more ${money}.`); }

        dataHelper.updateBalanceForAccount(payerAccount, 'tix', payerBalance-amount);
        dataHelper.updateBalanceForAccount(payeeAccount, 'tix', payeeBalance+amount);
        
        return message.channel.send(`Successfully sent ${amount} ${money} to ${payee}`);
    }
}