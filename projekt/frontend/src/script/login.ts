import { renderHeader } from './header';
import { checkLogin } from './main';

const BASE_URL = 'http://localhost:3000';

export function printLogin() {
  const main = document.querySelector('#main');
  if (main != undefined) {
    main.innerHTML = `
    <div class="main-container">
    <h1>Förenkla ditt <span class= 'text-agile'>agila arbetsflöde</span> med Ivars PlaneringsPoker</h1>
    <div class="main-content">
      <div id="loginContainer">
        <form id="loginUser">
          <h4>Logga in:</h4>
          <div id="loginMessage"></div>
          <label for="loginUsername">
            <input id="loginUsername" type="text" placeholder="Användarnamn">
          </label>
          <br>
          <label for="loginPassword">
            <input id="loginPassword" type="password" placeholder="Lösenord">
          </label>
          <br>
          <button>Logga in</button>
        </form>
        <form id="createUser">
          <h4>Skapa användare:</h4>
          <div id="createMessage"></div>
          <label for="createUsername">
            <input id="createUsername" type="text" placeholder="Användarnamn">
          </label>
          <br>
          <label for="createPassword">
            <input id="createPassword" type="password" placeholder="Lösenord">
          </label>
          <br>
          <button>Skapa</button>
        </form>
      </div> 
      <img class="login-img" alt="en byrå vid namn Ivar" src="/sideboard-svgrepo-com-blk.svg"/>
    </div>
    </div>
  `;
  }

  const loginUserForm = document.querySelector('#loginUser');
  loginUserForm?.addEventListener('submit', loginUser);

  const createUserForm = document.querySelector('#createUser');
  createUserForm?.addEventListener('submit', createUser);
}

function loginUser(e: Event) {
  e.preventDefault();
  const name = (document.querySelector('#loginUsername') as HTMLInputElement).value;
  const password = (document.querySelector('#loginPassword') as HTMLInputElement).value;

  if (name && password) {
    const user = { name, password };
    sessionStorage.setItem('user', JSON.stringify(user));

    fetch(BASE_URL + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw response.json();
        }
      })
      .then((data) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        renderHeader();
        checkLogin();
      })
      .catch((err) => {
        const message = document.querySelector('#loginMessage') as HTMLDivElement;
        message.innerHTML = `it seems something went wrong : ${err}`;
      });
  }
}

function createUser(e: Event) {
  e.preventDefault();

  const name = (document.querySelector('#createUsername') as HTMLInputElement).value;
  const password = (document.querySelector('#createPassword') as HTMLInputElement).value;

  if (name && password) {
    const user = { name, password };

    fetch(BASE_URL + '/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw response.json();
        }
      })
      .then((data) => {
        const message = document.querySelector('#createMessage') as HTMLDivElement;
        message.innerHTML = `User ${data.name} created!`;
      })
      .catch(() => {
        const message = document.querySelector('#createMessage') as HTMLDivElement;
        message.innerHTML = 'Name is already taken.';
      });
  }
}
