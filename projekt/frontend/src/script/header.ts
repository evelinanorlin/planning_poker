import { checkLogin } from "./main";

export function renderHeader() {
  const headerElement = document.querySelector('#header') as HTMLElement;
  headerElement.innerHTML = '';
  
  if (headerElement != undefined) {
    const title = document.createElement('h1') as HTMLElement;
    title.textContent = 'Ivars PlaneringsPoker';

    const button = document.createElement('button') as HTMLButtonElement;

    const user = JSON.parse(localStorage.getItem('user') as string);
    
    if (user) {
      if (user.admin) {
      title.innerHTML = `Välkommen ${user.name}, till Ivars Planeringspoker! Inloggad som admin.`;
      } else {
        title.innerHTML = `Välkommen <span class="user-name">${user.name}</span>, till Ivars Planeringspoker!`;
        }
      
        button.innerText = 'Logga Ut';

        button.addEventListener('click', () => {
          localStorage.removeItem("user");
          headerElement.innerHTML = '';
          checkLogin();
          renderHeader();
        });

      headerElement.appendChild(button);
    } 

    headerElement.prepend(title);
  }
}

 