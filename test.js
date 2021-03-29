const event = require('./events/randomEvent');

for (var i=0;i<10;i++) {
    let result = event.run();

    console.log(result);
}
