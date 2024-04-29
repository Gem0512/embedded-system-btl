import './App.css';
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function App() {
  // Kết nối đến MQTT Broker
  const client = mqtt.connect('mqtt://broker.example.com');

  // Hàm gửi thông điệp MQTT
  const sendControlSignal = (signal) => {
    client.publish('arduino/control', signal);
  };

  // Sự kiện cho nút trái
  const handleLeftButtonClick = () => {
    sendControlSignal('left');
  };

  // Sự kiện cho nút phải
  const handleRightButtonClick = () => {
    sendControlSignal('right');
  };

  // Sự kiện cho nút tiến
  const handleForwardButtonClick = () => {
    sendControlSignal('forward');
  };

  // Sự kiện cho nút lùi
  const handleBackwardButtonClick = () => {
    sendControlSignal('backward');
  };

  useEffect(() => {
    // Đăng ký lắng nghe các tín hiệu từ Arduino
    client.on('message', function (topic, message) {
      // Xử lý các thông điệp nhận được từ Arduino
      console.log('Received message:', message.toString());
    });

    // Đăng ký lắng nghe các tín hiệu từ Arduino
    client.subscribe('arduino/status');

    // Xử lý khi kết nối thành công
    client.on('connect', function () {
      console.log('Connected to MQTT Broker');
    });

    // Xử lý khi có lỗi xảy ra
    client.on('error', function (error) {
      console.error('MQTT Error:', error);
    });

    // Đảm bảo rằng bạn hủy đăng ký lắng nghe khi component unmounts
    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="App">
      <h1>Điều Khiển Arduino qua MQTT</h1>
      <div>
        <button onClick={handleLeftButtonClick}>Trái</button>
        <button onClick={handleRightButtonClick}>Phải</button>
        <button onClick={handleForwardButtonClick}>Tiến</button>
        <button onClick={handleBackwardButtonClick}>Lùi</button>
      </div>
    </div>
  );
}

export default App;
