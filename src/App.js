import './App.css';
import React, { useState, useEffect } from 'react';
import DynamicImage from './components/DynamicImage';
import mqtt from 'mqtt';

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Kết nối đến broker MQTT
    const options = {
      clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8), // Unique client ID
    };
    const client = mqtt.connect('mqtt://26.44.85.218:1883', options);

    

    client.on('connect', () => {
      console.log('Connected to broker');

      // Đăng ký topic mà bạn muốn nhận dữ liệu
      client.subscribe('test', (err) => {
        if (!err) {
          console.log('Subscribed to topic');
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      // Khi nhận được tin nhắn từ broker
      const newMessage = message.toString();
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Cleanup khi component bị hủy
    return () => {
      client.end();
    };
  }, []);
 
 
  return (
    <div style={{
      background: 'linear-gradient(#e66465, #9198e5)',
      height: 1020,
      paddingTop: 5
    }}>
      <div className="App" style={{
      display: 'flex',
      justifyContent: 'center',
      // marginTop: 5,
       }}>
        <DynamicImage imageUrl="http://192.168.123.137/cam-lo.jpg" interval={50} />
    </div>
    <div className="App" style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: 5,
      // width: 300
    }}>
       <div style={{
        backgroundColor: 'white',
        width: 350,
        height: 40,
        alignItems: 'center',
        display:'flex',
        justifyContent: 'center'
       }} className='status'>
         {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
       </div>
    </div>
    </div>
  );
}

export default App;
