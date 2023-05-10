import { io } from 'socket.io-client';
export const socket = io("http://localhost:3000");

import { printUserList } from './printUser';
import { IUser } from '../models.ts/IUser';
import { roundFibonacci } from './roundFibonacci';
import { renderPoints } from './adminView';


socket.on('connect', () => {
  console.log('socket.on front connected')
})

socket.on('userJoined', (userName: string, activeUsers: IUser[]) => {
  console.log(`${userName} has joined the game! Active Users: ${JSON.stringify(activeUsers)}`);
  printUserList(activeUsers);
});

socket.on("voteOver", (currentVotes: {voteNumber: string}[], comingTasks, chosenTask) => {
  renderPoints(comingTasks, chosenTask);

  const votesArr: number[] = [];
  currentVotes.map(currentVote => {
    if(currentVote.voteNumber == '?'){
      console.log('a ?mark')
    } else {
      const vote: number = parseInt(currentVote.voteNumber);
      votesArr.push(vote)
    }
  })
  
  const reducedNumber = votesArr.reduce((a, b) => Number(a) + Number(b)) / votesArr.length;
  
  const closestFibonacci = roundFibonacci(reducedNumber);

  const container = document.querySelector("#averageSP") as HTMLHeadingElement;
  container.innerHTML = `Medelvärdet blev: ${closestFibonacci}`;

  const voteBtns = document.querySelectorAll(".voteBtn");
  voteBtns.forEach(btn => btn.setAttribute("disabled", ""));
})
