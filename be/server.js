const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
app.use(cors()); 
const mqttClient = mqtt.connect('mqtt://26.44.85.218');
let state = 0
let command = 0
mqttClient.on('connect', function () {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('state');
  mqttClient.subscribe('command');
});

mqttClient.on('message', function (topic, message) {
  console.log('Received message:',topic, message.toString());
  if(topic == "state") state = message.toString();
  if(topic == "command") command = message.toString();
});

app.post('/publish', (req, res) => {
  // Publish message to MQTT broker
  const message = req.body.message;
  mqttClient.publish('your_topic', message);
  res.send('Message published');
});

app.get('/latest-data', (req, res) => {
    res.json({ state: state, command: command });
  });

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
