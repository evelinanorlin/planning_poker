import { io } from 'socket.io-client';
export const socket = io("http://localhost:3000");

import { printUserList } from './printUser';
import { IUser } from '../models.ts/IUser';
import { roundFibonacci } from './roundFibonacci';


socket.on('connect', () => {
  console.log('socket.on front connected')
})

// socket.on('disconnect', () => {
//   const user = JSON.parse(sessionStorage.getItem('user') as string);
//   if (user) {
//     socket.emit('userDisconnected', user.id);
//   }
// });

socket.on('userJoined', (userName: string, activeUsers: IUser[]) => {
  console.log(`${userName} has joined the game! Active Users: ${JSON.stringify(activeUsers)}`);
  printUserList(activeUsers);
});

// export function userToSocket(data: IUser) {
//   const user = { id: data.id, name: data.name };
//   console.log(user);
  
//   }

socket.on("voteOver", (currentVotes: Array<any>) => {
  console.log(currentVotes)
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
