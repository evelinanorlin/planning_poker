console.log("were connected");
import '/src/styles/_header.scss'

// import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// const socket = io("http://localhost:3001");

import { renderHeader } from './header';
import { printLogin } from './login';
import { renderAdmin } from './adminView'
import { printHTML } from './loggedIn';

const app = document.querySelector('#app') as HTMLElement;
app.innerHTML = `
  <header class='header' id='header'></header>
  <main class='main' id='main'></main>
  <footer id='footer' class='footer' </footer>`;


// const tasksArr: any = [];
// renderAdmin(tasksArr);

export function checkLogin() {
  if (localStorage.getItem("user")) {
    printHTML();
  } else {
    printLogin();
  }
}

const init = () => {
  renderHeader();
  checkLogin();
};
  
init();