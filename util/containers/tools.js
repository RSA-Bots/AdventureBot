function createItem(name, buy = 0, id, localized, category = "Items", description) {
    return {
        name: name,
        buy: buy,
        id: id,
        localized: localized,
        category: category,
        description: description,
        owns: false
    }
}

module.exports = {
    'sword': createItem('Sword', 2000, 1, 'sword', 'Tools', 'Allows fending off monsters'),
    'furnace': createItem('Furnace', 2000, 2, 'furnace', 'Appliances', 'Allows smelting of ores, cooking of food, and more'),
    'workbench': createItem('Workbench', 2000, 3, 'workbench', 'Appliances', 'Allows crafting of basic recipes')
}