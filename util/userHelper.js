const userData = require('../db/models/userData');

let loadedAccounts = [];
let offloadTime = [];

var offloadcheck = setInterval(checkOffload, 5000);
var autosaveTimer = setInterval(autosave, 1000*60*2);

/** Used to check if an account should be offloaded from memory. Interval: 5 seconds */
var offloadCheck = setInterval(checkOffload, 5000);

/** Autosave. Interval: 2 minutes */
var autosaveTimer = setInterval(autosave, 1000*60*2)

function checkOffload() {
    let currentMilli = new Date().getTime();

    for (var userId in loadedAccounts) {
        let offloadAt = offloadTime[userId];

        if (currentMilli >= offloadAt) {
            console.log(`Saving ${userId}`);
            saveUserAccount(userId);
            offloadUserAccount(userId);
        }
    }
}

function autosave() {
    for (var userId in loadedAccounts) {
        saveUserAccount(userId);
    }
}

function updateOffloadTime(userId) {
    let currentMilli = new Date().getTime();

    offloadTime[userId] = currentMilli + (1000*60*30);
}

async function saveUserAccount(userId) {
    console.log(`Saving ${userId}`);
    let account = loadedAccounts[userId];

    if (account) {
        await userData.updateOne({holderId: userId}, account);
    }
}

function offloadUserAccount(userId) {
    delete loadedAccounts[userId];
    delete offloadTime[userId];
}

function isAccountLoaded(userId) {
    return loadedAccounts[userId] != null;
}

module.exports = {
    // Getters
    // loadAccountById (userId: Snowflake) -> null
    loadAccount: async function(userId, initialName, gender, race) {
        if (!loadedAccounts[userId]) {
            let account = await userData.findOne({holderId: userId});
            
            if (!account) {
                if (!initialName && !gender) {
                    return 'Failed to create account from fetch. Please run `a;start` to get started!';
                }
                account = new userData({
                    holderId: userId,
                    name: initialName,
                    gender: gender,
                    race: race
                })

                await account.save();
            }

            loadedAccounts[userId] = account;
            updateOffloadTime(userId);
        }
    },

    // getLocation (userId: Snowflake) -> {location: String, error: String}
    getLocation: async function(userId) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {location: 'void', error: error}
        }

        return {location: loadedAccounts[userId]['location']}
    },

    // getPosition (userId: Snowflake) -> {x: Number, y: Number}
    getPosition: async function(userId) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {pos: {}, error: error}
        }

        return {pos: {
            x: loadedAccounts[userId]['posX'],
            y: loadedAccounts[userId]['posY']
        }}
    },

    // getLevel (userId: Snowflake) -> level: Number
    // getExp (userId: Snowflake) -> exp: Long
    // getMoney (userId: Snowflake) -> money: Long
    // getEquipment (userId: Snowflake) -> equip: Array
    // getBackpack (userId: Snowflake) -> backpack: Array
    // getGender (userId: Snowflake) -> {gender: String, error: String}
    getGender: async function(userId) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {gender: 'void', error: error}
        }

        return {gender: loadedAccounts[userId]['gender']}
    },

    // Setters
    // setLocation (userId: Snowflake, location: String)
    setLocation: async function(userId, location) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {error: error}
        }

        loadedAccounts[userId]['location'] = location;
    },

    // setPosition (userId: Snowflake, posX: Number, posY: Number)
    setPosition: async function(userId, posX, posY) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {error: error}
        }

        loadedAccounts[userId]['posX'] = posX;
        loadedAccounts[userId]['posY'] = posY;
    },
    
    // updateExp (userId: Snowflake, expChange: Long)
    updateExp: async function(userId, expChange) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {error: error}
        }

        loadedAccounts[userId]['exp'] += expChange;
    },

    // updateMoney (userId: Snowflake, moneyChange: Long)
    updateMoney: async function(userId, moneyChange) {
        let error;
        if (!isAccountLoaded(userId)) { error = await this.loadAccount(userId); }

        if (error) {
            return {error: error}
        }

        loadedAccounts[userId]['money'] += moneyChange;
    },
    // updateEquipment (userId: Snowflake, slot: String, newItem: String)
    // updateBackpack (userId: Snowflake, slot: String, newItem: String or null, change: Long)
}