import { io } from 'socket.io-client';
export const socket = io("http://localhost:3000");


socket.on('connect', () => {
  console.log('socket.on front connected')
})


export function userToSocket(data: any) {
    const user = { id: data.id, name: data.name };
    console.log(user);
    socket.emit('userLoggedIn', user);
  }


