import { checkLogin } from "./main";
import { socket } from './sockets';

export function renderHeader() {
  const headerElement = document.querySelector('#header') as HTMLElement;
  headerElement.innerHTML = '';
  
  if (headerElement != undefined) {
    const title: HTMLHeadingElement = document.createElement('h1');
    title.textContent = 'Ivars PlaneringsPoker';

    const logOutBtn: HTMLButtonElement = document.createElement('button');

    const user = JSON.parse(localStorage.getItem('user') as string);

    //const adminContainer: HTMLElement = document.getElementById('adminContainer') as HTMLElement;

    const main: HTMLElement = document.querySelector('#main') as HTMLElement;
    
    if (user) {
      if (user.admin) {
      title.innerHTML = `Välkommen <span class="user-name">${user.name}</span>,<br> till Ivars Planeringspoker!<br> <span class="user-admin">Inloggad som admin.</span>`;
      } else {
        title.innerHTML = `Välkommen <span class="user-name">${user.name}</span> till Ivars Planeringspoker!`;
        }
      
        logOutBtn.innerText = 'Logga Ut';

        logOutBtn.addEventListener('click', () => {
          const user = JSON.parse(localStorage.getItem('user') as string);
          if (user) {
            socket.emit('userLoggedOut', user.id);
          }

          localStorage.removeItem("user");
          headerElement.innerHTML = '';
          //adminContainer.innerHTML = '';
          main.innerHTML = '';
          checkLogin();
          renderHeader();
        });

      headerElement.appendChild(logOutBtn);
    } 

    headerElement.prepend(title);
  }
}


 