import { io } from 'socket.io-client';
import { IUser } from '../models.ts/IUser';

const socket = io("http://localhost:3000");



export function printUser() {
  const main: HTMLElement = document.querySelector('#main') as HTMLElement;
  main.innerHTML = `
  <section id="adminContainer" class="adminContainer"></section>
    <div id="votingContainer">
      <div class="voting">
        <h1 id="currentTask">Ingen task just nu</h1>
        <h2 id="averageSP">Hur många SP?</h2>
        <div class="voteBtns">
          <button class="voteBtn" disabled>0</button>
          <button class="voteBtn" disabled>1</button>
          <button class="voteBtn" disabled>3</button>
          <button class="voteBtn" disabled>5</button>
          <button class="voteBtn" disabled>8</button>
          <button class="voteBtn" disabled>?</button>
        </div>
        <div id="activeUsers" class="activeUsers"></div>
      </div>
        <div id="nextIssuesDiv" class="issuesCont1">
          <h1>Kommande issues:</h1>
          <ul id="upcomingTasks"></ul>
        </div>
        <div id="prevIssuesDiv" class="issuesCont2">
          <h1>Föregående issues:</h1>
          <ul id="finishedTasks"></ul>
        </div>
    </div>
  `;

  const voteBtns = document.querySelectorAll('.voteBtn');
  voteBtns.forEach(btn => {
    btn.addEventListener('click', (e: Event) => {
      const element = e.currentTarget as HTMLButtonElement;
      const value = element.innerText;

      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user') || '');
        console.log(user.id + ' has voted ' + value + ' SP');
        socket.emit('userVoted', value, user);
      }
    })
  })
}

socket.on('addTask', (arg: []) => {
  printTasks(arg)
})

socket.on('voteTask', (arg, activeUsers) => {
  printTasks(arg.arr);
  showTask(arg.task);
  printUserList(activeUsers);
})

socket.on('userVoted', (activeUsers) => {
  printUserList(activeUsers);
})

socket.on('finishedTasks', (arg) => {
  showPoints(arg[arg.length - 1]);
  printFinishedTasks(arg)
})

export function printUserList(usersConnected: IUser[]) {
  const activeUserList: HTMLElement | null = document.querySelector('#activeUsers') as HTMLElement;
  if (!activeUserList) {
    return;
  }
  activeUserList.innerHTML = usersConnected.map((user: IUser) => {
    if (user.vote) {
      return `<div class='${user.hasVoted ? 'voted' : ''}' data-userid=${user.id}><p id='userName' class='userName'>${user.name}<br>har<br>röstat</p></div>`;
    } else {
      return `<div class='${user.hasVoted ? 'voted' : ''}' data-userid=${user.id}><p id='userName' class='userName'>${user.name}<br>har inte<br>röstat än</p></div>`;
    }
  }).join('');
}

export function renderUserResult(activeUsers: IUser[]) {
  activeUsers.map((user: IUser) => {
    const userDiv = document.querySelector(`div[data-userid='${user.id}']`);
    if (userDiv) {
      userDiv.innerHTML = `<p id='userName' class='userName'>${user.name}<br>röstar på<br>${user.vote} SP</p>`;
      userDiv.classList.add('result');
    }
  });
}

export function printTasks(tasks: []) {
  const upcomingTasks: HTMLElement = document.getElementById('upcomingTasks') as HTMLElement;
  upcomingTasks.innerHTML = '';
  tasks.map((task: string) => {
    console.log('runs')
    upcomingTasks.innerHTML += `
    <li>${task}</li>`;
  })
}

export function showTask(task: string) {
  const voteBtns = document.querySelectorAll(".voteBtn");
  voteBtns.forEach(btn => btn.removeAttribute("disabled"));

  const currentTask: HTMLElement = document.getElementById('currentTask') as HTMLElement;
  currentTask.innerHTML = task;
}

function showPoints(pointsGiven: {task: string, points: string}) {
  const currentTask: HTMLElement = document.getElementById('currentTask') as HTMLElement;
  currentTask.innerHTML = `
  Scrum-master gav "${pointsGiven.task}" ${pointsGiven.points} SP`;
}

export function printFinishedTasks(tasks: []) {
  const finishedTasksLi: HTMLElement = document.getElementById('finishedTasks') as HTMLElement;
  finishedTasksLi.innerHTML = '';
  tasks.map((currTask: {task: string, points: string}) => {
    finishedTasksLi.innerHTML += `
  <li>${currTask.task}, ${currTask.points} SP</li>`;
  })
}

export const activeUsers: IUser[] = [];