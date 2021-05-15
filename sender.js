const mqtt = require('mqtt');

const options = {
    host: '65fc34ab05c0415389b469aed437ba0d.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'pranavsindura',
    password: 'PranavKota1!'
}

const client = mqtt.connect(options);

client.on('connect', ()=>{
    console.log('Ready to send');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', (topic, message)=>{
    console.log('Received:', topic, message.toString());
});

// client.subscribe('test');

client.publish('test', 'Hello all receivers you ar eworking on a saturday lol')