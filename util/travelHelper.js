const user = require('./userHelper');

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
    startTravel: function(message, id, startData, destinationData, totalTimeInSeconds, maxEvents) {
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

        var timeIterated = 0;
        var currentEvents = 0;

        setInterval(async function() {
            timeIterated += 5;

            let userPos = await user.getPosition(id);
            let pos = userPos.position;
            console.log(`moving ${id} {${pos.x}, ${pos.y}}`);
            let newPos = lerp(startData['pos'], destinationData['pos'], timeIterated/totalTimeInSeconds)

            await user.setPosition(id, newPos.x, newPos.y);
            console.log(`moved ${id} {${newPos.x}, ${newPos.y}}`);

            if (currentEvents < maxEvents) {
                let chance = Math.floor(Math.random() * 100) + 1; //1 to 100
                if (chance >= 80) { //80 - 100
                    currentEvents += 1;
                    //message.reply('Event start');
                    message.reply(await randomEvent.run().result());
                }
            }

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