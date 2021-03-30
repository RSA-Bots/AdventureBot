const user = require('./userHelper');
const world = require('./worldHelper');

const randomEvent = require('../events/randomEvent');

var travelList = [];
var travelData = [];

function lerp(origin, dest, alpha) {
    if (alpha > 1) { alpha = 1; }

    let x = origin.x + (dest.x - origin.x) * alpha
    let y = origin.y + (dest.y - origin.y) * alpha

    return {x: x, y: y}
}

module.exports = {
    /**
     * Starts the travelling, updates every 5 seconds.
     * Handles spawning of events while travelling.
     * 
     * @param {Snowflake} id 
     * @param {JSON} startData -Starting location data
     * @param {JSON} destinationData -Destination location data
     * @param {Number} totalTimeInSeconds -Total time to travel in seconds (real world time)
     * @param {Number} maxEvents -max number of random events that can occur this trip
     * @returns null
     */
    startTravel: async function(message, id, startData, destinationData, totalTimeInSeconds, maxEvents) {
        if (travelList[id]) {
            return;
        }

        travelList[id] = true;
        travelData[id] = {
            start: startData.name,
            destination: destinationData.name,
            maxEvents: maxEvents,
            currentEvents: 0,
            timeRemaining: 0
        }

        //set player city to area to define no longer in city.
        let userLoc = await user.getLocation(id);

        if (userLoc.location != startData.localized) {
            await user.setLocation(id, world.getCityArea(startData.localized));
        }

        var timeIterated = 0;
        var currentEvents = 0;
        var lastEvent = 0;

        setInterval(async function() {
            timeIterated += 5;

            let userPos = await user.getPosition(id);
            let pos = userPos.pos;
            let newPos = lerp(startData['pos'], destinationData['pos'], timeIterated/totalTimeInSeconds)

            await user.setPosition(id, newPos.x, newPos.y);

            // if (currentEvents < maxEvents) {
                // check if lastEvent happened over 10% of the remaining time ago.
                // Issue: As you get closer to the destination, events happen more and more often.
                // Solution: Set minimum tenPercent. Goal: 80 second minimum delay
                let tenPercent = Math.max((totalTimeInSeconds-timeIterated)/10, 80);
                if (timeIterated-lastEvent > tenPercent || lastEvent == 0) {
                    let chance = Math.floor(Math.random() * 100) + 1; //1 to 100
                    if (chance >= 80) { //80 - 100
                        currentEvents += 1;
                        lastEvent = timeIterated;
                        //message.reply('Event start');
                        let { event, result, error } = await randomEvent.run();

                        if (error) {
                            message.reply(error);
                        } else {
                            if (event === 'Hitchhike') {
                                // add 30 in-game minutes to timeIterated
                                // time is 4 in-game minutes to 1 real minute
                                // 30 in-game minutes == 7.5 real minutes
                                timeIterated += 450
                            }
                            message.reply(`Type: ${event}\nResult: ${result}`);
                        }
                    }
                }
            // }

            // handle is time remaining is less than 5 seconds.
            // if (timeRemaining < 5) {}
            if (timeIterated >= totalTimeInSeconds) {
                await user.setLocation(id, destinationData['localized'])
                travelList[id] = false;
                clearInterval(this);
                message.reply('Destination has been reached.');
            } else {
                //console.log(`Time remaining: ${totalTimeInSeconds-timeIterated} seconds`);
                travelData[id] = {
                    start: startData.name,
                    destination: destinationData.name,
                    maxEvents: maxEvents,
                    currentEvents: currentEvents,
                    timeRemaining: totalTimeInSeconds-timeIterated
                }
            }
        }, 5000);
    },

    isTravelling: function(id) {
        return travelList[id];
    },

    getTravelData: function(id) {
        return travelData[id];
    }
}