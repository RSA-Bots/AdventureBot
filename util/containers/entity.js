let ID = 0;

function createEntity(name, commonDrop, rareDrop) {
    ID += 1;
    return {
        name: name,
        id: ID,
        dropTable: {
            commonDrop: commonDrop,
            rareDrop: rareDrop
        }
    }
}

module.exports = {
    'sheep': createEntity('Sheep', 'raw_mutton', 'wool'),
    'cow': createEntity('Cow', 'raw_beef', 'leather'),
    'pig': createEntity('Pig', 'raw_pork', ''),
    'chicken': createEntity('Chicken', 'raw_chicken', 'feather')
}