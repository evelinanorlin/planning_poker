import { checkLogin } from './main';
const BASE_URL = 'http://localhost:3000';

export function printLogin() {
  const app = document.querySelector('#app');
  if (app != undefined) {
    app.innerHTML = /*html*/`
    <div id="loginContainer">
    <form id="loginUser">
      <h4>Login:</h4>
      <div id="loginMessage"></div>
      <input id="loginUsername" type="text" placeholder="Username">
      <br>
      <input id="loginPassword" type="password" placeholder="Password">
      <br>
      <button>Login</button>
    </form>
    <form id="createUser">
      <h4>Create user:</h4>
      <div id="createMessage"></div>
      <input id="createUsername" type="text" placeholder="Username">
      <br>
      <input id="createPassword" type="password" placeholder="Password">
      <br>
      <button>Create</button>
    </form>
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
    localStorage.setItem('user', JSON.stringify(user));

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
        localStorage.setItem('user', JSON.stringify(data));
        checkLogin();
      })
      .catch((err) => {
        const message = document.querySelector('#loginMessage') as HTMLDivElement;
        message.innerHTML = `it seems something went wrong : ${err}`;
      });
  }
}
  
function createUser(e: Event) {
  const CLOUD_URL = 'https://sea-lion-app-cr49a.ondigitalocean.app';
  e.preventDefault();

  const name = (document.querySelector('#createUsername') as HTMLInputElement).value;
  const password = (document.querySelector('#createPassword') as HTMLInputElement).value;

  if (name && password) {
    const user = { name, password };

    fetch(CLOUD_URL + '/users/add', {
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
      .catch((err) => {
        const message = document.querySelector('#createMessage') as HTMLDivElement;
        message.innerHTML = 'Name is already taken.';
      });
  }
}
