
export function renderHeader() {
    const app = document.querySelector('#app');
    console.log('connected')

    const header = document.createElement('header');
    header.setAttribute('class', 'header');

    const title = document.createElement('h1');
    title.textContent = 'Ivars PlaneringsPoker';

    const button = document.createElement('button');

    if (sessionStorage.getItem('isLoggedIn')) {
        button.textContent = 'Logga Ut';
    } else {
        button.textContent = 'Logga In';
    }

    button.addEventListener('click', () => {
        console.log('Button clicked!');

        if (sessionStorage.getItem('isLoggedIn')) {
            sessionStorage.removeItem('isLoggedIn');
            button.textContent = 'Logga IN';
            title.textContent = 'Ivars PlaneringsPoker';

        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
            button.textContent = 'Logga Ut';
            title.textContent = 'Välkommen {{user}}';
            title.textContent += ' - inloggad som admin';
        }

        // const isAdmin = true;
        // hämta userObject med isAdmin = true från back?
        // if(isAdmin ) {
        //     title.textContent += ' - inloggad som admin';
        // }

      });

    header.appendChild(title);
    header.appendChild(button);

    app?.appendChild(header);
}

