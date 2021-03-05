function createItem(name, singular, plural, buy = 0, sell = 0, amount = 0, id, localized, category = "Items", rarity = "Common", rating = 0, buyable = true, sellable = true, smeltable = false, smeltCost = 0, smeltResult = '', smeltResultAmount = 0) {
    return {
        name: name,
        singular: singular,
        plural: plural,
        buy: buy,
        sell: sell,
        amount: amount,
        id: id,
        localized: localized,
        category: category,
        rarity: rarity,
        rating: rating,
        buyable: buyable,
        sellable: sellable,
        smeltable: smeltable,
        smeltCost: smeltCost,
        smeltResult: smeltResult,
        smeltResultAmount: smeltResultAmount
    }
}

module.exports = {
    'boot': createItem('Boot', 'a Boot', 'Boots', 5, 2, 0, 1, 'boot', 'Items', 'Common', 0, true, true),
    'fish': createItem('Fish', 'a Fish', 'Fish', 10, 6, 0, 2, 'fish', 'Food', 'Common', 0, true, true),
    'kelp': createItem('Kelp', 'a Kelp', 'Kelp', 7, 3, 0, 3, 'kelp', 'Items', 'Uncommon', 0, true, true),
    'seeds': createItem('Seeds', 'a Seed', 'Seeds', 5, 1, 0, 4, 'seeds', 'Food', 'Common', 0, true, true),
    'wheat': createItem('Wheat', 'Wheat', 'Wheat', 10, 4, 0, 5, 'wheat', 'Food', 'Common', 0, true, true),
    'carrot': createItem('Carrot', 'a Carrot', 'Carrots', 7, 3, 0, 6, 'carrot', 'Food', 'Common', 0, true, true),
    'potato': createItem('Potato', 'a Potato', 'Potatoes', 15, 4, 0, 7, 'potato', 'Food', 'Common', 0, true, true, true, 2, 'baked_potato', 1),
    'hide': createItem('Hide', 'a Hide', 'Hide', 60, 25, 0, 8, 'hide', 'Items', 'Common', 0, true, true),
    'antler': createItem('Antler', 'an Antler', 'Antlers', 44, 15, 0, 9, 'antler', 'Items', 'Uncommon', 0, true, true),
    'raw_meat': createItem('Raw Meat', 'a Raw Meat', 'Raw Meat', 12, 7, 0, 10, 'raw_meat', 'Food', 'Common', 0, true, true, true, 3, 'cooked_meat', 1),
    'cooked_meat': createItem('Cooked Meat', 'a Cooked Meat', 'Cooked Meat', 30, 18, 0, 11, 'cooked_meat', 'Food', 'Rare', 0, true, true),
    'gios_rose': createItem('Gio\'s Rose', 'Gio\'s Rose', 'of Gio\'s Roses', 0, 0, 0, 12, 'gios_rose', 'Items', 'Forbidden', 0, false, false),
    'stick': createItem('Stick', 'a Stick', 'Sticks', 2, 1, 0, 13, 'stick', 'Items', 'Common', 0, true, true),
    'wood': createItem('Log', 'a Log', 'Logs', 16, 8, 0, 14, 'wood', 'Items', 'Common', 0, true, true, true, 4, 'charcoal', 1),
    'apple': createItem('Apple', 'an Apple', 'Apples', 6, 3, 0, 13, 'apple', 'Food', 'Common', 0, true, true),
    'baked_potato': createItem('Baked Potato', 'a Baked Potato', 'Baked Potatoes', 32, 16, 0, 14, 'baked_potato', 'Food', 'Uncommon', 0, true, true),
    'charcoal': createItem('Charcoal', 'a Charcoal', 'Charcoal', 30, 13, 0, 15, 'charcoal', 'Fuel', 'Uncommon', 0, true, true),
    'rock': createItem('Rock', 'a Rock', 'Rocks', 2, 1, 0, 16, 'rock', 'Items', 'Common', 0, true, true),
    'bone': createItem('Bone', 'a Bone', 'Bones', 12, 7, 0, 17, 'bone', 'Items', 'Common', 0, true, true),
    'shell': createItem('Shell', 'a Shell', 'Shells', 5, 2, 0, 18, 'shell', 'Items', 'Common', 0, true, true),
    'femboy': createItem('Femboy', 'a Femboy', 'Femboys', 0, 0, 0, 69, 'femboy', 'Collectables', 'Forbidden', 0, false, false),
    'manifesto': createItem('The Scala Manifesto', 'The Scala Manifesto', 'copies of The Scala Manifesto', 0, 0, 0, 1235700381, 'manifesto', 'Collectables', 'Forbidden', 0, false, false),
    'planet': createItem('Planet', 'a Planet', 'Planets', 0, 0, 0, 720, 'planet', 'Collectables', 'Forbidden', 0, false, false),
}