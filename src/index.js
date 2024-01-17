import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// stream
import {
  WHIPClient,
  WHEPClient
} from 'red5pro-webrtc-sdk'

const config = {
  protocol: 'ws',
  host: 'localhost',
  port: 5080,
  app: 'live',
  streamName: 'mystream',
  rtcConfiguration: {
    iceServers: [{urls: 'stun:stun2.l.google.com:19302'}],
    iceCandidatePoolSize: 2,
    bundlePolicy: 'max-bundle'
  } // See https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
}

const start = async () => {

  try {

    const publisher = new WHIPClient()
    await publisher.init(config)
    await publisher.publish()

    const subscriber = new WHEPClient()
    await subscriber.init(config)
    await subscriber.subscribe()

  } catch (e) {
    console.error(e)
  }

}

start()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
