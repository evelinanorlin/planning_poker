import { io } from 'socket.io-client';
export const socket = io("http://localhost:3000");

import { printUserList } from './printUser';
import { IUser } from '../models.ts/IUser';


socket.on('connect', () => {
  console.log('socket.on front connected')
})

socket.on('userJoined', (userName: string, activeUsers: IUser[]) => {
  console.log(`${userName} has joined the game! Active Users: ${JSON.stringify(activeUsers)}`);
  printUserList(activeUsers)
});

export function userToSocket(data: any) {
    const user = { id: data.id, name: data.name };
    console.log(user);
    socket.emit('userLoggedIn', user);
  }


