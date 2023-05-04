console.log("were connected");
import '../styles/style.scss';

import { io } from 'socket.io-client';
const socket = io("http://localhost:3000");

socket.on('connect', () => {
  console.log('connected')
})

import { renderHeader } from './header';
import { printLogin } from './login';
import { renderAdmin } from './adminView'
import { printHTML } from './loggedIn';

const app = document.querySelector('#app') as HTMLElement;
app.innerHTML = `
  <header class='header' id='header'></header>
  <main class='main' id='main'></main>
  <footer id='footer' class='footer' </footer>`;


const tasksArr: any = [];
renderAdmin(tasksArr);

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