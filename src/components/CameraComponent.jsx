// import React, { useRef, useEffect } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import { Hands } from '@mediapipe/hands';

// const CameraComponent = () => {
//   const videoRef = useRef();
//   const canvasRef = useRef();

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then(function(stream) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         })
//         .catch(function(err) {
//           console.error('Something went wrong with getting the media stream: ', err);
//         });
//     }

//     // const detectFromVideoStream = async () => {
//     //   const model = await cocoSsd.load();
//     //   setInterval(async () => {
//     //     const predictions = await model.detect(videoRef.current);
//     //     // Vẽ các dự đoán lên canvas
//     //     const ctx = canvasRef.current.getContext('2d');
//     //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     //     predictions.forEach(prediction => {
//     //       ctx.beginPath();
//     //       ctx.rect(...prediction.bbox);
//     //       ctx.lineWidth = 2;
//     //       ctx.strokeStyle = 'red';
//     //       ctx.fillStyle = 'red';
//     //       ctx.stroke();
//     //       ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
//     //     });
//     //   }, 100);
//     // };

//     const detectHandGesture = async () => {
//       const hands = new Hands({ locateFile: (file) => `F:/Ki2_nam4/He_thong_nhung/embedded-system/src/mediapipe_hands/${file}` });
//       await hands.load();
      
//       setInterval(async () => {
//         const predictions = await hands.estimateHands(videoRef.current);
//         const ctx = canvasRef.current.getContext('2d');
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
//         if (predictions.length > 0) {
//           predictions.forEach((prediction) => {
//             const landmarks = prediction.landmarks;
            
//             // Vẽ các điểm landmarks
//             ctx.fillStyle = 'red';
//             landmarks.forEach((landmark) => {
//               ctx.fillRect(landmark[0], landmark[1], 5, 5);
//             });
            
//             // Vẽ đường biên của bàn tay
//             ctx.beginPath();
//             ctx.lineWidth = 2;
//             ctx.strokeStyle = 'red';
//             ctx.moveTo(landmarks[0][0], landmarks[0][1]);
//             for (let i = 1; i < landmarks.length; i++) {
//               const [x, y] = landmarks[i];
//               ctx.lineTo(x, y);
//             }
//             ctx.closePath();
//             ctx.stroke();
//           });
//         }
//       }, 100);
//     };
    
//     detectHandGesture();
//     // detectFromVideoStream();

//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} width="640" height="480" />
//       <canvas ref={canvasRef} width="640" height="480" />
//     </div>
//   );
// };

// export default CameraComponent;


import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

const CameraComponent = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadHandposeModel = async () => {
      // Load the handpose model
      const loadedModel = await handpose.load();
      setModel(loadedModel);
    };

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error('Something went wrong with getting the media stream: ', err);
      }
    };

    const detectHandGesture = async () => {
      if (!model) return;

      // Function to continuously process video frames
      const processVideo = async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          // Make predictions on video frames
          const predictions = await model.estimateHands(videoRef.current);

          // Draw the hand landmarks on the canvas
          drawHandLandmarks(predictions);
        }
        requestAnimationFrame(processVideo);
      };

      processVideo(); // Start processing video frames
    };

    const drawHandLandmarks = (predictions) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (predictions.length > 0) {
        predictions.forEach(hand => {
          const landmarks = hand.landmarks;

          // Draw landmarks
          ctx.fillStyle = 'red';
          landmarks.forEach(landmark => {
            const x = landmark[0];
            const y = landmark[1];
            ctx.fillRect(x, y, 5, 5);
          });

          // Draw hand boundary
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.moveTo(landmarks[0][0], landmarks[0][1]);
          for (let i = 1; i < landmarks.length; i++) {
            const [x, y] = landmarks[i];
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        });
      }
    };

    loadHandposeModel();
    setupCamera();
    detectHandGesture();

  }, [model]);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default CameraComponent;
