const server = require('http').createServer();

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});
//random location coordinates to show realtime unlocks
const randomLocationsCords = [
    {
        latitude: 23.424076,
        longitude: 53.847818,
    },
    {
        latitude: -11.202692,
        longitude: 17.873887,
    },
    {
        latitude: -38.416097,
        longitude: -63.616672,
    },
    {
        latitude: 47.516231,
        longitude: 14.550072,
    },
    {
        latitude: -25.274398,
        longitude: 133.775136,
    },
    {
        latitude: 23.684994,
        longitude: 90.356331,
    }, {
        latitude: 23.684994,
        longitude: 90.356331,
    },
    {
        latitude: 50.503887,
        longitude: 4.469936,
    },
    {
        latitude: 42.733883,
        longitude: 25.48583,
    },
    {
        latitude: -14.235004,
        longitude: -51.92528,
    },
    {
        latitude: 56.130366,
        longitude: -106.346771,
    },
    {
        latitude: 46.818188,
        longitude: 8.227512,
    },
    {
        latitude: -35.675147,
        longitude: -71.542969,
    },
    {
        latitude: 35.86166,
        longitude: 104.195397,
    }];

let country_i = 0;
let idCounttemp = 0;
io.on('connection', client => {
    console.log('Connected to Server');
    setInterval(() => {
        if (country_i == randomLocationsCords.length - 1) {
            country_i = 0;
        }
        let reandomLocation = randomLocationsCords[country_i++];
        let unlocksData = {
            id: idCounttemp++,
            actor_type: "string",
            actor_id: 0,
            actor_name: "string",
            action: "unlock",
            object_type: "Lock",
            object_id: 0,
            object_name: "string",
            success: true,
            error_code: null,
            error_message: null,
            created_at: new Date(),
            location: reandomLocation,
            message: 'New Door Unlocked Here',
            references: [
                {
                    id: 0,
                    type: "Lock"
                },
                {
                    id: 0,
                    type: "Organization"
                },
                {
                    id: 0,
                    type: "Place"
                },
                {
                    id: 0,
                    type: "RoleAssignment"
                }
            ]
        }
        client.emit('unlock', unlocksData);
    }, 3000);
});

server.listen(4000);
