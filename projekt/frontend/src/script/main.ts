import '../styles/style.scss';
import { socket } from "./sockets";
import { renderHeader } from './header';
import { printLogin } from './login';
import { renderAdmin } from './adminView'
import { printUser } from './printUser';
import { printTasks } from './printUser';
import { printFinishedTasks } from './printUser';
import { showTask } from './printUser';

const app = document.querySelector('#app') as HTMLElement;
app.innerHTML = `
  <header class='header' id='header'></header>
  <main class='main' id='main'></main>
  <footer id='footer' class='footer'><p>&copy; IVAR Medieinstitutet 2023</p> </footer>`;

export function checkLogin() {
  if (sessionStorage.getItem("user")) {
    printUser();

    socket.emit('loadSite');

    socket.on('loadSite', (coming, finished, current) => {
      console.log(current)
      renderAdmin(coming);
      printTasks(coming);
      printFinishedTasks(finished);
      if(current){
        showTask(current);
      } else{
        showTask('Inget att rösta på');
        const voteBtns = document.querySelectorAll(".voteBtn");
        voteBtns.forEach(btn => btn.setAttribute("disabled", ""));
      }
    })
    socket.emit('userLoggedIn', JSON.parse(sessionStorage.getItem("user") || ""));
  } else {
    printLogin();
    showTask('Inget att rösta på just nu');
  }
}

const init = () => {
  renderHeader();
  checkLogin();
};

init();