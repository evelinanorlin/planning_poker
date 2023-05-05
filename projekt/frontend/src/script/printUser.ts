import { io } from 'socket.io-client';
const socket = io("http://localhost:3000");

const usersConnected = [
    { name: 'Sebastian', id: 0 },
    { name: 'Erik', id: 1 }
  ];
  const numbers = [0, 1, 2, 3, 5, 8, '?'];
  const issues = ['Issue1', 'Issue2', 'Issue3'];
  const currentIssue = issues[2];
  //const pastIssues = ['PastIssue1', 'PastIssue2', 'PastIssue3'];
  export function printUser() {
    const main: HTMLElement = document.querySelector('#main') as HTMLElement;
    main.innerHTML = `
    <section id="adminContainer" class="adminContainer"></section>
      <div id="votingContainer">
        <h1>Aktuell uppgift att rösta om: ${currentIssue}</h1>
        <div id="issuesContainer">
          <h1>Användare</h1>
          <ul>
            ${usersConnected.map(user => `<li>${user.name}</li>`).join('')}
          </ul>
        </div>
        <div id="nextIssuesDiv">
          <h1>Kommande issues:</h1>
          <ul id="upcomingTasks">
          </ul>
        </div>
        <div id="prevIssuesDiv">
          <h1>Föregående issues:</h1>
          <ul>
            ${issues.map(issue => `<li>${issue}</li>`).join('')}
          </ul>
        </div>
        <h1>Välj poäng:</h1>
      </div>
    `;
    const votingContainer: HTMLElement = document.querySelector('#votingContainer') as HTMLElement;
    const numberButtons = numbers.map(number => {
        const button = document.createElement('button');
        button.classList.add('numberButton');
        button.textContent = number.toString();
        button.addEventListener('click', () => {
          console.log(button.textContent);
        });
        return button;
      });
    numberButtons.forEach(button => {
      votingContainer.appendChild(button);
    });
  }
  
  socket.on('task', (arg: []) => {
    printTasks(arg)
  })

  function printTasks(tasks: []){
    const upcomingTasks: HTMLElement = document.getElementById('upcomingTasks') as HTMLElement;
    upcomingTasks.innerHTML = '';
    tasks.map((task: string) => {
      upcomingTasks.innerHTML += `
      <li>${task}</li>`;
    })
  }
  