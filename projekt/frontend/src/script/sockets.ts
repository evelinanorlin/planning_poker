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

socket.on("voteOver", (currentVotes: []) => {
  const reducedNumber = currentVotes.reduce((a, b) => Number(a.voteNumber) + Number(b.voteNumber)) / currentVotes.length;
  
  const closestFibonacci = roundFibonacci(reducedNumber);

  const container = document.querySelector("#averageSP") as HTMLHeadingElement;
  container.innerHTML = `Medelvärdet blev: ${closestFibonacci}`;

  const voteBtns = document.querySelectorAll(".voteBtn");
  voteBtns.forEach(btn => btn.setAttribute("disabled", ""));
})
