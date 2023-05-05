import { checkLogin } from "./main";

export function renderHeader() {
  const headerElement = document.querySelector('#header') as HTMLElement;
  headerElement.innerHTML = '';
  
  if (headerElement != undefined) {
    const title = document.createElement('h1') as HTMLElement;
    title.textContent = 'Ivars PlaneringsPoker';

    const logOutBtn = document.createElement('button') as HTMLButtonElement;

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


 