let events = {
    0: {
        name: "Fight",
        weight: 4,
        list: {
            0: {
                name: "Rat",
                hp: 10,
                atk: 2,
                def: 1,
                weight: 4,
                reward: {
                    exp: 3,
                    money: 2
                }
            },
            1: {
                name: "Bird",
                hp: 6,
                atk: 3,
                def: 1,
                weight: 5,
                reward: {
                    exp: 2,
                    money: 0
                }
            },
            2: {
                name: "Thief",
                hp: 25,
                atk: 6,
                def: 3,
                weight: 3,
                reward: {
                    exp: 15,
                    money: 30
                }
            },
        }
    },
    1: {
        name: "Find",
        weight: 4,
        list: {
            0: {
                name: "money",
                max: 10,
                min: 3,
                weight: 2
            },
            1: {
                name: "item",
                weight: 5,
                list: {
                    0: {
                        name: "apple",
                        weight: 4
                    },
                    1: {
                        name: "parchment",
                        weight: 2
                    },
                    2: {
                        name: "rope",
                        weight: 4
                    }
                }
            }
        }
    },
    2: {
        name: "Hitchhike",
        weight: 1
    },
    3: {
        name: "Nothing",
        weight: 10,
        list: {
            0: {
                s: "A bird flew over and startled you.",
                weight: 4
            },
            1: {
                s: "That annoying sweat bee has been bothering you for quite some time.",
                weight: 4
            },
            2: {
                s: "You ponder what it would be like arriving at your destination.",
                weight: 4
            }
        }
    }
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array
}

module.exports = {
    run: async function() {
        let eventChances = [];

        for (var event in events) {
            for (var i=0;i<events[event].weight;i++) {
                eventChances.push(event);
            }
        }

        for (var i=0;i<5;i++) {
            eventChances = shuffle(eventChances);
        }

        let eventPick = Math.floor(Math.random() * eventChances.length);
        let eventData = events[eventChances[eventPick]];
        
        let retData = {}

        retData['event'] = eventData.name;

        if (eventData.name === 'Nothing') {
            let phrases = eventData.list;
            let phraseChances = [];

            for (var phrase in phrases) {
                for (var i=0;i<phrases[phrase].weight;i++) {
                    phraseChances.push(phrase);
                }
            }

            for (var i=0;i<5;i++) {
                phraseChances = shuffle(phraseChances);
            }

            let phrasePick = Math.floor(Math.random() * phraseChances.length);
            let phraseData = phrases[phraseChances[phrasePick]];

            retData['result'] = phraseData.s;
        } else if(eventData.name === 'Hitchhike') {
            retData['result'] = "Lucky! You got a ride from a random stranger! (Shortened your trip by 30 in-game minutes)"
        } else if(eventData.name === 'Find') {
            let items = eventData.list;
            let itemChances = [];

            for (var item in items) {
                for (var i=0;i<items[item].weight;i++) {
                    itemChances.push(item);
                }
            }

            for (var i=0;i<5;i++) {
                itemChances = shuffle(itemChances);
            }

            let itemPick = Math.floor(Math.random() * itemChances.length);
            let itemData = items[itemChances[itemPick]];
            
            if (itemData.name === 'money') {
                let amount = Math.floor(Math.random() * (itemData.max - itemData.min)) + itemData.min;

                retData['result'] = `You found ${amount} money.`
            } else if(itemData.name === 'item') {
                let aItems = itemData.list;
                let aItemChances = [];

                for (var aItem in aItems) {
                    for (var i=0;i<aItems[aItem].weight;i++) {
                        aItemChances.push(aItem);
                    }
                }

                for (var i=0;i<5;i++) {
                    aItemChances = shuffle(aItemChances);
                }

                let aItemPick = Math.floor(Math.random() * aItemChances.length);
                let aItemData = aItems[aItemChances[aItemPick]];

                retData['result'] = `You found ${aItemData.name}.`
            }
        } else if(eventData.name === 'Fight') {
            retData['result'] = "You got into a fight. You probably lost.."
        }

        return retData;
    }
}