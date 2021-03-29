const https = require('https')
const userHelper = require('../../util/userHelper');

const genders = {'male': 'male', 'female': 'female'};
const races = {'human': 'white', 'lizard': 'reptbluenowings', 'orc': 'orc', 'wolf': 'wolfwhite', 'skeleton': 'skeleton', 'minotaur': 'barbarian_minotaur'};

module.exports = {
    name: 'start',
    description: 'Create your character to begin using AdventureBot',
    usage: `[flags]\`\nFlag based system!\n\`-g:[male/female]\` - Will specify gender. \`Default: Male\`\n\`-r:[human/lizard/orc/wolf/skeleton/minotaur]\` - Will specify race. \`Default: Human\`\n\n\`More flags **and options** will come in a future update!`,
    args: true,
    guildOnly: true,
    ownerOnly: true,
    async execute(message, args) {
        let userId = message.author.id;
        if (!(await userHelper.loadAccount(userId))) {
            return message.reply('You already have an account created.');
        }

        let name = message.member.displayName;
        let gender = 'male';
        let race = 'human';

        for (var arg of args) {
            console.log(arg);
            if (arg.startsWith('-g')) {
                gender = arg.slice('-g:'.length).toLowerCase()
                console.log(gender);
            }
            if (arg.startsWith('-r')) {
                race = arg.slice('-r:'.length).toLowerCase()
                console.log(race);
            }
        }

        if (genders[gender] && races[race]) {
            await userHelper.loadAccount(userId, name, gender, race);
            return message.reply(`Successfully create ${gender} character ${name} with ID: ${userId}`);
        } else {
            return message.reply(`Provided an invalid flag. Please try again.`);
        }
    }
}