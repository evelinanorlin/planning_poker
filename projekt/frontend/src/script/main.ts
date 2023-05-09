console.log("were connected");
import '../styles/style.scss';
import { io } from 'socket.io-client';
const socket = io("http://localhost:3000");

import { renderHeader } from './header';
import { printLogin } from './login';
import { renderAdmin } from './adminView'
import { printUser } from './printUser';
import { printTasks } from './printUser';
import { printFinishedTasks } from './printUser';

const app = document.querySelector('#app') as HTMLElement;
app.innerHTML = `
  <header class='header' id='header'></header>
  <main class='main' id='main'></main>
  <footer id='footer' class='footer' </footer>`;

export function checkLogin() {
  if (sessionStorage.getItem("user")) {
    printUser();
    socket.emit('loadSite');
    socket.on('loadSite', (coming, finished) => {
        renderAdmin(coming);
        printTasks(coming);
        printFinishedTasks(finished);
    })
  } else {
    printLogin();
  }
}

const init = () => {
  renderHeader();
  checkLogin();
};


  
init();