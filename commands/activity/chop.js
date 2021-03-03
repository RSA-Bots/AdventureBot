const items = ['stick', 'wood', 'apple', 'wood', 'stick', 'wood'];

const dataHelper = require('../../util/dataHelper');

module.exports = {
    name: 'chop',
    description: 'Go chop some wood',
    guildOnly: true,
    cooldown: 30,
    async execute(message, args) {
        let userId = message.author.id;
        let account = await dataHelper.getAccount(userId);

        dataHelper.incrementStatForAccount(account, 'fishing');

        let chance = Math.floor(Math.random()*100);

        if (chance <= 60) {
            let itemChance = Math.floor(Math.random()*items.length);
            let item = items[itemChance];

            let amount = 1;
            if (account.inventory) {
                if (account.inventory[0] && account.inventory[0][item]) {
                    amount += account.inventory[0][item]['amount'];
                }
            }
            dataHelper.updateItemForAccount(account, item, amount);
            let name = dataHelper.getItem(item).name;

            return message.reply(`You found a ${name}`);
        } else {
            return message.reply('Better luck next time!');
        }
    }
}