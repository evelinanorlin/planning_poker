import { socket } from './sockets';
export function renderAdmin(tasksArr: string[]){
  const adminContainer: HTMLElement = document.getElementById('adminContainer') as HTMLElement;
  const user = JSON.parse(sessionStorage.getItem('user') || "");

  if(user.admin == true){
    adminContainer.innerHTML = `
    <div class="adminFlex">
      <div class="flexDiv">
        <h2>Vad ska vi rösta om idag?</h2>
        <form onsubmit="return false">
          <label for="taskInput">Lägg till uppgift:</label><br>
          <input type="text" id="taskInput" name="task"><br>
          <button id="taskBtn" type="button">Lägg till</button>
        </form>
      </div>
      <div class="flexDiv">
        <h2>Vilken uppgift ska vi rösta om nu?</h2>
        <div class="tasks">
          <ul id="tasksList" class="tasksList"></ul>
        </div>
        <button type="button" id="finishBtn">Avsluta session</button>
        <button type="button" id="finishAndSaveBtn">Avsluta och spara session</button>
      </div>
    </div>
    `;
    const taskInput: HTMLInputElement = document.getElementById('taskInput') as HTMLInputElement;
    const finishAndSaveBtn = document.getElementById('finishAndSaveBtn');
    const finishBtn = document.getElementById('finishBtn');
  
    if (finishAndSaveBtn) {
      finishAndSaveBtn.addEventListener('click', function() {
        socket.emit('endSessionAndSaveBack');
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener('click', function () {
        socket.emit('endSessionBack');
    });
  };

    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        if(taskInput.value){
          addTask(taskInput, tasksArr)
        } else return;
      }
    })
  
    document.getElementById('taskBtn')?.addEventListener('click', () => {
      if(taskInput.value){
        addTask(taskInput, tasksArr)
      } else return;
    })

  } else{
    adminContainer.innerHTML = '';
  }
}


export function rendertasks(arr: string[]){
  const tasksList: HTMLElement = document.getElementById('tasksList') as HTMLElement;

  tasksList.innerHTML = ``;

  for (let i = 0; i < arr.length; i ++){
    tasksList.innerHTML += `
    <li class=task id="${i}">${arr[i]}</li>
    `;
  }

  const allTasks = document.querySelectorAll('.task')

  allTasks.forEach((task) => {
    task.addEventListener('click', (e: Event) => {
      
      if (e.target instanceof HTMLElement) {
        const chosenTask: string = e.target.innerHTML;
        arr = arr.filter((task: string) => task !== chosenTask);
        const container = document.querySelector("#averageSP") as HTMLHeadingElement;
        container.innerHTML = `Hur många SP?`;

        socket.emit('voteTask', chosenTask)

        renderLockAdmin();
      }
    })
  })
}

function addTask(taskInput: HTMLInputElement, tasksArr: string[]){
  if(taskInput.value){
    const task: string = taskInput.value;
    tasksArr.push(task)
    taskInput.value = ``;
    rendertasks(tasksArr);
    socket.emit('addTask', task);
  } else return;
}

export function renderPoints(arr: string[], chosenTask: string){
  const user = JSON.parse(sessionStorage.getItem('user') || "");

  if(user.admin == true){
    const adminContainer: HTMLElement = document.getElementById('adminContainer') as HTMLElement;
    adminContainer.innerHTML = `
    <h3>Hur många SP vill du ge till "${chosenTask}"?</h3>
    <div class="adminPointsBtns">
    <button class="pointButton">0</button>
    <button class="pointButton">1</button>
    <button class="pointButton">3</button>
    <button class="pointButton">5</button>
    <button class="pointButton">8</button>
    </div>`;

    const pointsBtns = document.querySelectorAll('.pointButton');

    pointsBtns.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        if (e.target instanceof HTMLElement) {
        const points: string = e.target.innerHTML;
        console.log(points);
        socket.emit('finishedTasks', {'points': points, 'task': chosenTask});
        
        renderAdmin(arr);
        rendertasks(arr);
        }
      })
    })
  } else {
    return;
  }
}

function renderLockAdmin(){
  const adminContainer: HTMLElement = document.getElementById('adminContainer') as HTMLElement;
  adminContainer.innerHTML = `<h2>Vänta medan dina undersåtar röstar...</h2>`;
}