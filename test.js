const randomEvent = require('./events/randomEvent');

async function test10() {
    for (var i=0;i<10;i++) {
        let { event, result, error } = await randomEvent.run();
    
        if (error) {
            //message.reply(error);
            console.log(error);
        } else {
            //message.reply();
            console.log(`Type: ${event}\nResult: ${result}\n`);
        }
    }
}

test10();