const Discord = require('discord.js');
const Canvas = require('canvas');
const helper = require('../../util/helper')

module.exports = {
    name: 'map',
    description: 'Map things',
    async execute(message, args) {
        let userId = message.author.id;

        let gender = await helper.user.getGender(userId);
        let location = await helper.user.getPosition(userId);

        if (gender.error) { return message.reply(gender.error); }
        if (location.error) { return message.reply(location.error); }

        gender = gender.gender;

        const canvas = Canvas.createCanvas(2048, 1536);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./res/map_1.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        //const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
        const avatarImg = (gender == 'male') ? './res/male_sprite_default.png' : './res/female_sprite_default.png';
        const avatar = await Canvas.loadImage(avatarImg);

        let pos = location.pos;

        ctx.drawImage(avatar, pos.x - 34, pos.y - 50, 68, 100);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'map-bg.png');

        let userLoc = await helper.user.getLocation(userId);

        message.reply(`You are currently in ${userLoc.location}!`, attachment);
    }
}