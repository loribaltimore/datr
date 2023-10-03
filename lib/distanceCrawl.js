module.exports = function distanceCrawl(increment){
const R = 6371000; // Earth's radius in meters
    const d = 100; // Distance in meters
    const direction = increment % 5 === 0 ? 'north' : increment % 3 === 0 ? 'south' : increment % 2 === 0 ? 'east' : 'west';
    const lat = 47.59393655869544;
    const long = -122.19556331634521
    let newLong;
    let newLat;

const deltaLat = (d* increment / R) * (180 / Math.PI) / Math.cos(long * (Math.PI / 180)); // Convert from radians to degrees
const deltaLong = (d* increment / R) * (180 / Math.PI) / Math.cos(lat * (Math.PI / 180)); // Convert lat1 from degrees to radians
    switch (direction) {
        case 'north':
            newLat = lat + deltaLat;
            newLong = long;
            break;
        case 'south':
            newLat = lat - deltaLat;
            newLong = long;
            break;
        case 'east':
            newLat = lat;
            newLong = long + deltaLong;
            break;
        case 'west':
            newLat = lat;
            newLong = long - deltaLong;
            break;
    }

console.log("New Latitude:", newLat);
    console.log("New Longitude:", newLong);
    return [newLong, newLat];
}

