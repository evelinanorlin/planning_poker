

export function printHTML() {
    // const app = document.querySelector("#app") as HTMLDivElement;
    // if (app != undefined) {
    //   app.innerHTML = `
    const main = document.querySelector('#main') as HTMLElement;
    if(main != undefined) {
        main.innerHTML= `
      <h1>INLOGGAD!!</h1>
    `;
    }
    // const logoutBtn = document.querySelector("#logoutBtn");
    // logoutBtn?.addEventListener("click", () => {
    //   localStorage.removeItem("user");
    //   checkLogin();
    // })
  }
  
//   checkLogin();
  ;