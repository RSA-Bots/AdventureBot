const worldData = require('../dataObjects/world_data.json');

module.exports = {
    getAreaData: function (area) {
        return worldData[area];
    },

    getCityData: function (city) {
        for (var areaId in worldData) {
            const areaData = worldData[areaId];

            return areaData['cities'][city];
        }
    },

    getCityArea: function (city) {
        for (var areaId in worldData) {
            const areaData = worldData[areaId];

            if (areaData['cities'][city]) {
                return areaId
            }
        }

        return -1;
    },

    getDungeonArea: function (dungeon) {
        for (var areaId in worldData) {
            const areaData = worldData[areaId];

            if (areaData['dungeons'][dungeon]) {
                return areaId
            }
        }

        return -1;
    },

    getDistanceToCity: function (start, destination) {
        const pos1 = start.pos;
        const pos2 = this.getCityData(destination).pos;

        return Math.sqrt(Math.pow((pos2.y-pos1.y), 2)+Math.pow((pos2.x-pos1.x), 2));
    }
}