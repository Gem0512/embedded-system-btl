import './App.css';
import React, { useState, useEffect } from 'react';
import DynamicImage from './components/DynamicImage';
import mqtt from 'mqtt';
import axios from 'axios';

function App() {

   const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/latest-data');
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data immediately and then periodically every 5 seconds
    fetchData();
    const interval = setInterval(fetchData, 50);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
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
        height: 50,
        alignItems: 'center',
        display:'flex',
        justifyContent: 'center'
       }} className='status'>
        <div>
          <div style={{
            fontWeight: 'bold'
          }}>Yêu cầu đến xe</div>
          <div style={{
          display:'flex',
          justifyContent: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}>
        {data?.command ==='0'?(
          "Dừng"
        ): data?.command ==='1'?(
          "Tiến"
        ):  data?.command ==='2'?(
          "Lùi"
        ):  data?.command ==='3'?(
          "Trái"
        ):(
          "Phải"
        ) }</div>
        </div>
       </div>
       <div style={{
        backgroundColor: 'white',
        width: 350,
        marginLeft: 50,
        height: 50,
        alignItems: 'center',
        display:'flex',
        justifyContent: 'center'
       }} className='status'>
         <div>
         <div style={{
            fontWeight: 'bold'
          }}>Trạng thái của xe</div>
        <div style={{
          display:'flex',
          justifyContent: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}>{data?.state ==='0'?(
          "Dừng"
        ): data?.state ==='1'?(
          "Tiến"
        ):  data?.state ==='2'?(
          "Lùi"
        ):  data?.state ==='3'?(
          "Trái"
        ):(
          "Phải"
        ) }</div>
         </div>
       </div>
    </div>
    </div>
  );
}

export default App;
