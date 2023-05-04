import '../styles/style.scss'

import { printLogin } from './login';

export function checkLogin() {
  if (localStorage.getItem("user")) {
    printHTML();
  } else {
    printLogin();
  }
}

function printHTML() {
  const app = document.querySelector("#app") as HTMLDivElement;
  if (app != undefined) {
    app.innerHTML = `<h1>INLOGGAD!!</h1>`;
  }
}

checkLogin();
