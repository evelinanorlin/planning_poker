export function printHTML() {
    const main = document.querySelector('#main') as HTMLElement;
    if(main != undefined) {
        main.innerHTML= `
      <h1>INLOGGAD!!</h1>
    `;
    }
  }
  ;