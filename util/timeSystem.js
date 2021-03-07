const dataHelper = require('./dataHelper');
const helper = require('./helper');

const { guildId, announceChannelId } = require('../config.json')

let Client = null;

let day = 1;
let hour = 0;

function getState() {
    if (hour == 0) return 'Midnight';
    if (hour >= 1 && hour < 6) return 'Dawn';
    if (hour >= 6 && hour < 9) return 'Morning';
    if (hour >= 9 && hour < 12) return 'Mid-Morning';
    if (hour >= 12 && hour < 13) return 'Noon';
    if (hour >= 13 && hour < 16) return 'Afternoon';
    if (hour >= 16 && hour < 21) return 'Evening';
    if (hour >= 21) return 'Night';
}

async function announceDayChange(inChannel) {
    if (inChannel) {
        let guild = await Client.guilds.resolve(guildId);
        
        if (guild) {
            let channel = await guild.channels.resolve(announceChannelId);

            if (channel) {
                channel.send(`Day ${day}`);
                
            } else {
                console.log('No channel.');
            }
        } else {
            console.log('No guild.');
        }
    }

    return Client.user.setPresence({ activity: { name: `Day ${day} - Hour ${hour} [${getState()}]`, type: 'WATCHING'} })
}

module.exports = {
    start: async function(client) {
        Client = client;
        await announceDayChange();
        setInterval(async function() {
            hour = hour + 1
        
            if (hour >= 24) {
                hour = 0;
                day = day + 1
            }

            await announceDayChange();
        }, 1000*60*15);
    },

    getState: getState
}