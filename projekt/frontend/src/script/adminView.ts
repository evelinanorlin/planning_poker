
export function renderAdmin(){
  const tasksArr: any = [];
  const adminContainer: HTMLElement = document.getElementById('adminContainer') as HTMLElement;
  adminContainer.innerHTML = `
  <h2>Vad ska vi rösta om idag?</h2>
  <form onsubmit="return false">
    <label for="task">Lägg till uppgift:</label><br>
    <input type="text" id="taskInput" name="task"><br>
    <button id="taskBtn" type="button">Lägg till</button>
  </form>
  <h2>Vilken uppgift ska vi rösta om nu?</h2>
  <div class="tasks">
    <ul id="tasksList" class="tasksList"></ul>
  </div>
  <button>Avsluta och spara session</button>
  `
  const taskInput: HTMLInputElement = document.getElementById('taskInput') as HTMLInputElement;

  document.getElementById('taskBtn')?.addEventListener('click', () => {
    const task: string = taskInput.value;
    tasksArr.push(task)
    taskInput.value = ``;
    rendertasks(tasksArr)
  })
}

function rendertasks(arr: any){
  console.log(arr)
  const tasksList: HTMLElement = document.getElementById('tasksList') as HTMLElement;

  tasksList.innerHTML = ``;

  for (let i = 0; i < arr.length; i ++){
    tasksList.innerHTML += `
    <li class=task id="${i}">${arr[i]}</li>
    `;
  }

  const allTasks = document.querySelectorAll('.task')

  allTasks.forEach((task) => {
    task.addEventListener('click', (e) => {
      console.log(e.target)
    })
  })
}