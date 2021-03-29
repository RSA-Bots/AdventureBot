const { travel } = require('../../util/helper');
const helper = require('../../util/helper');

module.exports = {
    name: "travel",
    description: "travel to a nearby location",
    usage: "[location] - If location is not provided, then will list possible moves.",
    guildOnly: true,
    ownerOnly: true,
    async execute(message, args) {
        /**
         * if destination in same area as currentLocation
         *      speed = 2.7 pixels / minute (game time)
         *      if horse
         *          speed *= 8
         * 
         *      dist = helper.world.getDistanceBetweenTwoCitites(currentLocation, destination)
         * 
         *      prompt user with time to take
         * 
         *      if continue
         *          generate random events at random intervals (max of 3 events per 100 pixels travelled)
         *      else
         *          do not travel
         */

        let userId = message.author.id;

        if (helper.travel.isTravelling(userId)) {
            let travelData = helper.travel.getTravelData(userId);

            return message.reply(`You are traveling from ${travelData.start} to ${travelData.destination}. There are ${travelData.timeRemaining} seconds remaining. You have encountered ${travelData.currentEvents} of ${travelData.maxEvents} events.`);
        }

        let destination = args.join(' ').toLowerCase();
        let playerLocation = await helper.user.getLocation(userId);

        let locationData = helper.world.getCityData(destination);

        if (!locationData) { return message.reply('That is not a valid location.'); }
        if (playerLocation.error) { return message.reply(playerLocation.error); }
        if (playerLocation.location && playerLocation.location == destination) { return message.reply(`You are already at ${locationData.name}.`); }

        let currentArea = helper.world.getCityArea(playerLocation.location);
        let destinationArea = helper.world.getCityArea(destination);

        if (currentArea != destinationArea) { return message.reply(`You are unable to travel to a different area. You either lack a boat, or airship.`); }

        let distance = Math.floor(helper.world.getDistanceToCity(playerLocation.location, destination))
        let speed = 2.7; //in-game speed pixels per minute
        let realTime = Math.floor(distance / (4 * speed));

        /**
         * time conversion: 1 in-game hour = 15 irl minutes
         *                  4 in-game min  = 1 irl minute
         */

        helper.travel.startTravel(message, userId, helper.world.getCityData(playerLocation.location), locationData, realTime*60, 3);

        return message.reply(`Traveling to ${locationData.name}\nDistance: ${distance}px\nSpeed: ${speed}pxm\nReal Time: ${realTime*60} seconds`);
    }
}