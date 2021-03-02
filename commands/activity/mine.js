const items = ['rock', 'bone', 'tix', 'shell', 'rock', 'bone', 'rock'];

const dataHelper = require('../../util/dataHelper');

module.exports = {
    name: 'mine',
    description: 'Go an explore a mine.',
    guildOnly: true,
    cooldown: 30,
    async execute(message, args) {
        let userId = message.author.id;
        let account = await dataHelper.getAccount(userId);

        dataHelper.incrementStatForAccount(account, 'mining');

        let chance = Math.floor(Math.random()*100);

        if (chance <= 60) {
            let itemChance = Math.floor(Math.random()*items.length);
            let item = items[itemChance];

            if (item === 'tix') {
                let found = Math.floor(Math.random()*4) + 1;
                dataHelper.updateBalanceForAccount(account, 'tix', account.wallet[0]['tix']['amount'] + found);
                return message.reply(`You found ${found} tix!`);
            } else {
                let amount = 1;
                if (account.inventory) {
                    if (account.inventory[0] && account.inventory[0][item]) {
                        amount += account.inventory[0][item]['amount'];
                    }
                }
                dataHelper.updateItemForAccount(account, item, amount);
                let name = dataHelper.getItem(item).name;

                return message.reply(`You found a ${name}`);
            }
        } else {
            return message.reply('Better luck next time!');
        }
    }
}