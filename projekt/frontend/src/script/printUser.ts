import { io } from 'socket.io-client';
const socket = io("http://localhost:3000");

import { IUser } from '../models.ts/IUser';

// const issues = ['Issue1', 'Issue2', 'Issue3'];
// const currentIssue = issues[2];
// export function printUser(usersConnected:  IUser[]) {

export function printUser() {
  const main: HTMLElement = document.querySelector('#main') as HTMLElement;
  main.innerHTML = `
  <section id="adminContainer" class="adminContainer"></section>
    <div id="votingContainer">
      <div class="voting">
        <h1 id="currentTask">Ingen task just nu</h1>
        <h2 id="averageSP">Hur många SP?</h2>
        <div class="voteBtns">
          <button class="voteBtn">0</button>
          <button class="voteBtn">1</button>
          <button class="voteBtn">2</button>
          <button class="voteBtn">3</button>
          <button class="voteBtn">5</button>
          <button class="voteBtn">8</button>
          <button class="voteBtn">?</button>
        </div>
        <div id="activeUsers" class="activeUsers">
          <div id="userVote">
        </div>
      </div>
        <div id="nextIssuesDiv" class="issuesCont">
          <h1>Kommande issues:</h1>
          <ul id="upcomingTasks"></ul>
        </div>
        <div id="prevIssuesDiv" class="issuesCont">
          <h1>Föregående issues:</h1>
          <ul id="finishedTasks"></ul>
        </div>
    </div>
  `;

  const voteBtns = document.querySelectorAll(".voteBtn");
  voteBtns.forEach(btn => {
    btn.addEventListener("click", (e: Event)=> {
      const element = e.currentTarget as HTMLButtonElement;
      const value = element.innerText;
     

      if (sessionStorage.getItem("user")) {
        const user = JSON.parse(sessionStorage.getItem("user") || '');
        console.log(user.id + ' has voted ' + value + ' SP');
          socket.emit("userVoted", value, user);

        }
    })
  })

  // <div class="issuesLists">
  //       <div id="nextIssuesDiv" class="issuesCont">
  //         <h1>Kommande issues:</h1>
  //         <ul id="upcomingTasks"></ul>
  //       </div>
  //       <div id="prevIssuesDiv" class="issuesCont">
  //         <h1>Föregående issues:</h1>
  //         <ul id="finishedTasks"></ul>
  //       </div>
  //     </div>
  // const votingContainer: HTMLElement = document.querySelector('#votingContainer') as HTMLElement;
  // const numberButtons = numbers.map(number => {
  //     const button = document.createElement('button');
  //     button.classList.add('numberButton');
  //     button.textContent = number.toString();
  //     button.addEventListener('click', () => {
  //       console.log(button.textContent);
  //     });
  //     return button;
  //   });
  // numberButtons.forEach(button => {
  //   votingContainer.appendChild(button);
  // });
}


socket.on('addTask', (arg: []) => {
  printTasks(arg)
})

socket.on('voteTask', (arg, activeUsers) => {
  printTasks(arg.arr);
  showTask(arg.task);
  printUserList(activeUsers);
})

socket.on("userVoted", (activeUsers) => {
  printUserList(activeUsers);
})

socket.on('finishedTasks', (arg) =>{
  showPoints(arg[arg.length - 1]);
  printFinishedTasks(arg)
})

export function printUserList(usersConnected:  IUser[]) {
  console.log(usersConnected);
  const activeUserList: HTMLElement | null = document.querySelector('#activeUsers') as HTMLElement;

  if (!activeUserList) {
    return;
  }
    
  activeUserList.innerHTML = usersConnected.map((user: IUser) => {  
    if (user.vote) {
      return `<div class="${user.hasVoted ? 'voted' : ''}" data-userid=${user.id}><p id="userName" class="userName">${user.name}<br>röstar på<br>${user.vote} SP</p></div>`;
    } else {
      return `<div class="${user.hasVoted ? 'voted' : ''}" data-userid=${user.id}><p id="userName" class="userName">${user.name}<br>har inte<br>röstat än</p></div>`;
    }
  }).join('');
}

export function printTasks(tasks: []){
  const upcomingTasks: HTMLElement = document.getElementById('upcomingTasks') as HTMLElement;
  upcomingTasks.innerHTML = '';
  tasks.map((task: string) => {
    console.log('runs')
    upcomingTasks.innerHTML += `
    <li>${task}</li>`;
  })
}

export function showTask(task: string){
  const currentTask: HTMLElement = document.getElementById('currentTask') as HTMLElement;
  currentTask.innerHTML = task;
}

function showPoints(pointsGiven: any){
  const currentTask: HTMLElement = document.getElementById('currentTask') as HTMLElement;
  currentTask.innerHTML = `
  Scrum-master gav "${pointsGiven.task}" ${pointsGiven.points} SP`;
}

export function printFinishedTasks(tasks: []){
  const finishedTasksLi: HTMLElement = document.getElementById('finishedTasks') as HTMLElement;
  finishedTasksLi.innerHTML = '';
  tasks.map((currTask: any) => {
  finishedTasksLi.innerHTML += `
  <li>${currTask.task}, ${currTask.points} SP</li>`;
  })
}
