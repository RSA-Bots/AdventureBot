const helper = require('../../util/helper')
const dataHelper = require('../../util/dataHelper')

module.exports = {
    name: 'baltop',
    description: 'Get the top money holders',
    guildOnly: true,
    cooldown: 5,
    async execute(message, args) {
        let money = helper.getMoneyEmoji(message, 'tix');
        const leaderboard = helper.generateEmptyEmbed('', `${money} board`);
        leaderboard.setDescription(`Top 10 ${money} holders`);

        let data = await dataHelper.getAllBalances();
        let balances = data['tempBalance'];

        let count = 0;
        let rows = [];
        let longestName = 0;
        let totalInEconomy = 0;

        for (var userId in balances) {
            if (userId != -2) {
                totalInEconomy += balances[userId];
            }
        }

        for (var userId in balances) {
            if (count >= 10) { break; }
            if (userId != -2) {
                count++;
                let displayName = userId;
                if (userId > 0) {
                    displayName = await helper.getDisplayNameFromId(message.guild, userId);
                } else if (userId == -1) {
                    displayName = '[Server]';
                }
                if (displayName.length > longestName) {
                    longestName = displayName.length;
                }
            }
        }

        count = 0;

        for (var userId in balances) {
            if (count >= 10) { break; }
            if (userId != -2) {
                count++;
                let displayName = userId;
                if (userId > 0) {
                    displayName = await helper.getDisplayNameFromId(message.guild, userId);
                } else if (userId == -1) {
                    displayName = '[Server]';
                }
                let dif = longestName - displayName.length;
                
                rows.push(`**${displayName}**: ${" ".repeat(dif)}${balances[userId]} ${money}`);
            }
        }

        console.log(rows);
        leaderboard.setDescription(`Top 10 ${money} holders\nTotal ${money} in world: ${totalInEconomy}`);
        leaderboard.addField('\u200b', rows.join('\n'), false);
        leaderboard.setFooter(`Last Updated: ${data['lastUpdated']}`);

        message.channel.send(leaderboard);
    }
}