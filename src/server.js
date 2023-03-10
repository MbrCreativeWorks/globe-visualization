const server = require('http').createServer();
const randomLocationsCords = require('./data/indian-cities.json');

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});
//random location coordinates to show realtime unlocks


let country_i = 0;
let idCounttemp = 0;
io.on('connection', client => {
    console.log('Connected to Server');
    setInterval(() => {
        if (country_i == randomLocationsCords.length - 1) {
            country_i = 0;
        }
        let reandomLocation = randomLocationsCords[country_i++];
        let date_ob = new Date();
        let time = date_ob.getTime();

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
            created_at: date_ob,
            created_time: time,
            location: reandomLocation,
            message: 'New Unlock',
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
    }, 200);
});

server.listen(4000);
