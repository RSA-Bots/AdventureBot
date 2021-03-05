const helper = require('../../util/helper');
const dataHelper = require('../../util/dataHelper');
const time = require('../../util/timeSystem');

let rewards = {
    ['forest']: {
        ['tier_1']: {
            'stick': { weight: 6, max: 3},
            'wood': { weight: 2, max: 2},
            'apple': {weight: 2, max: 3},
            'seeds': {weight: 2, max: 2},
        },
    },
    ['desert']: {
        ['tier_1']: {
            'sand': { weight: 5, max: 3},
            'cactus': { weight: 2, max: 3},
            'bone': { weight: 3, max: 3},
        },
    },
    ['river']: {
        ['tier_1']: {
            'fish': { weight: 3, max: 2},
            'boot': { weight: 4, max: 2},
            'kelp': { weight: 3, max: 3},
            'shell': { weight: 4, max: 4},
        },
    },
    ['cave']: {
        ['tier_1']: {
            'rock': { weight: 4, max: 4},
            'bone': { weight: 4, max: 2},
            'shell': { weight: 2, max: 2},
        },
        ['tier_2']: {}
    }
}

module.exports = {
    name: 'explore',
    description: 'Explore a specific location',
    args: true,
    usage: '<location>',
    cooldown: 7,
    guildOnly: true,
    async execute(message, args) {
        let location = args.join(' ');
        let locations = [];
        for (var loc in rewards) {
            locations.push(loc);
        }

        if (!rewards[location]) { return message.reply(`That is not a valid exploration location. Please try one of the following: ${locations.join(', ')}`)};

        let rewardsTableDef = rewards[location]['tier_1'];
        let rewardsTable = [];

        // Add items to rewards table based on weights
        for (var reward in rewardsTableDef) {
            console.log(reward);
            let data = rewardsTableDef[reward];
            let weight = data['weight'];

            for (var i=0; i<weight; i++) {
                rewardsTable.push(reward);
            }
        }

        // Shuffle rewards table
        for (let v = 0; v < 5; v++) {
            for (let i = rewardsTable.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rewardsTable[i], rewardsTable[j]] = [rewardsTable[j], rewardsTable[i]];
            }
        }

        // Pick item and amount <= max
        let random = Math.floor(Math.random() * rewardsTable.length);
        console.log(random);
        console.log(rewardsTable);
        let item = rewardsTable[random];
        console.log(item);
        let max = rewardsTableDef[item]['max'];
        let amount = Math.floor(Math.random()**2 * max) + 1;
        console.log(amount);

        // Reward player
        let itemDef = dataHelper.getItem(item);
        let display = (amount > 1 ? `${amount} ${itemDef.plural}` : itemDef.singular);

        let account = await dataHelper.getAccount(message.author.id);
        dataHelper.updateItemForAccount(account, itemDef.localized, amount);

        return message.reply(`You found ${display}`);
    }
}