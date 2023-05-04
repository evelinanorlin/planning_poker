console.log("were connected");
import '/src/styles/_header.scss';
// import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// const socket = io("http://localhost:3001");

import { renderHeader } from './header';

const init = () => {
renderHeader();
  };
  
  init();