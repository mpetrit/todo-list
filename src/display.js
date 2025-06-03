const moreProjects=document.getElementById("more-projects")
const taskContent=document.getElementById("content")
const homeProject=document.getElementById("home-project")
const todayProject=document.getElementById("today-project")

const userClassH1=document.querySelector(".user-class-h1")
const userClassButtons=document.querySelector(".class-buttons")

const taskDialogButton=document.getElementById("task-dialog-button")
const taskDialog=document.getElementById("task-dialog")
const taskTitle=document.getElementById("task-input-dialog")
const taskDate=document.getElementById("task-due-date")
const closeDialog= document.getElementById("dialog-close")
const dialogProject=document.querySelector(".dialog-project")

const taskPopup=document.querySelector(".popup-task")

let currentProjectId=0;
let editMode=false
let taskBeingEdited;

//Display the task of the current project
const projectTasksDisplayHandler=(allProjects)=>{
    console.log(currentProjectId)
    let el =allProjects.find(el=>el.id === currentProjectId)
    displayGroupOfTask(el.tasks,allProjects)
}



const displayGroupOfTask=(el,allProjects)=>{
    taskContent.textContent=""
    el.forEach((task)=>{

                    let taskCurrent=task.getTask()
                    let div=document.createElement("div")
                    div.classList.toggle("task-card")
                    console.log();
                    
                    div.classList.toggle(`${taskCurrent.priority}-priority`)
                    let confirmedCheckbox=document.createElement("input")
                    confirmedCheckbox.type="checkbox"
                    confirmedCheckbox.checked=taskCurrent.confirm
                    confirmedCheckbox.addEventListener("click",()=>{
                        task.completeTask()                        
                        currentProjectId=taskCurrent.classId
                        displaySideBarThings(allProjects)
                        let current =allProjects.find(el=>el.id === currentProjectId)
                        displayProjectView(current,allProjects)
                        userClassH1.textContent=`${current.name}`

                    })

                    let title=document.createElement("h2")
                    title.textContent=taskCurrent.title
                    
                    let dueDate=document.createElement("span")
                    dueDate.textContent=taskCurrent.dueDate
                    
                    let removeButton=document.createElement("button")
                    removeButton.textContent="X"
                    removeButton.addEventListener("click",()=>{
                        task.deleteTask()
                        currentProjectId=taskCurrent.classId
                        displaySideBarThings(allProjects)
                        let current =allProjects.find(el=>el.id === currentProjectId)
                        displayProjectView(current,allProjects)
                        userClassH1.textContent=`${current.name}`
                    })
                    
                    let editButton=document.createElement("button")
                    editButton.textContent="Edit"
                    editButton.addEventListener("click",()=>{
                        editMode=true
                        taskBeingEdited=task
                        currentProjectId=taskCurrent.classId
                        let current =allProjects.find(el=>el.id === currentProjectId)
                        showTaskDialogEdit(task,current)
                        displaySideBarThings(allProjects)
                        displayProjectView(current,allProjects)
                        userClassH1.textContent=`${current.name}`                  
                    })
                    div.appendChild(confirmedCheckbox)
                    div.appendChild(title)
                    div.appendChild(dueDate)
                    div.appendChild(removeButton)
                    div.appendChild(editButton)

                    taskContent.appendChild(div)
                })
}

function displayProjectView(el,allProjects){
                userClassButtons.textContent=""
                userClassH1.textContent=""
                console.log(el.name)
                projectTasksDisplayHandler(allProjects)
                userClassH1.textContent=`${el.name}`

                //Filters

                let filterTasksOnFinishedInProject=document.createElement("button")
                filterTasksOnFinishedInProject.textContent="Filter to show unfinished"
                
                filterTasksOnFinishedInProject.addEventListener("click",()=>{
                    el.filterTasksFinished()
                    displaySideBarThings(allProjects)
                    projectTasksDisplayHandler(allProjects)
                    let elClass =allProjects.find(el=>el.id === currentProjectId)
                    userClassH1.textContent=elClass.name
                })
                
                userClassButtons.appendChild(filterTasksOnFinishedInProject)                

                let filterTasksOnPrioirtyInProject=document.createElement("button")
                filterTasksOnPrioirtyInProject.textContent="Filter to show highest priority"
                
                filterTasksOnPrioirtyInProject.addEventListener("click",()=>{
                    el.filterTasksOnPriority()
                    displaySideBarThings(allProjects)
                    projectTasksDisplayHandler(allProjects)
                    let elClass =allProjects.find(el=>el.id === currentProjectId)
                    userClassH1.textContent=elClass.name
                })
                
                userClassButtons.appendChild(filterTasksOnPrioirtyInProject)                
                
                
                
                if(el.name==="Home" && el.id==0) return
                let buttonRemoveProject=document.createElement("button")
                buttonRemoveProject.textContent="Remove this Project"
                
                buttonRemoveProject.addEventListener("click",()=>{
                    if(el.tasks.length!=0) return
                    el.deleteThisProject()
                    currentProjectId=0
                    displaySideBarThings(allProjects)
                    projectTasksDisplayHandler(allProjects)
                    let elClass =allProjects.find(el=>el.id === currentProjectId)
                    userClassH1.textContent=elClass.name
                    userClassButtons.textContent=""
                    
                })
                userClassButtons.appendChild(buttonRemoveProject)                

    
}

// Function to display all projects in the sidebar
export  const displaySideBarThings=(allProjects)=>{
        moreProjects.innerHTML=""
        console.log(allProjects);

        allProjects.forEach((el)=>{
            let divContainer=document.createElement("div")
            divContainer.classList.toggle("sidebar-card")
            console.log(el.name);
            divContainer.textContent=el.name
            divContainer.addEventListener("click",()=>{
                currentProjectId=el.id
                displayProjectView(el,allProjects)
                
            })
            moreProjects.appendChild(divContainer)
                     
        })
    }

// Function to simulate the home project view
const homeProjectSim=(allTasks,allProjects)=>{  
        userClassH1.textContent='All tasks'
        userClassButtons.textContent=""
        displayGroupOfTask(allTasks,allProjects)
}
const todayProjectSim=(allTasks,allProjects)=>{  
        userClassH1.textContent="Today's tasks"
        userClassButtons.textContent=""
        displayGroupOfTask(allTasks,allProjects)
}



// Function to give event listeners in the first run of the application
// and to handle the task dialog
export const giveEventListnersToDialog=(indexValueHandler)=>{

    
    
    
    taskDialogButton.addEventListener("click",()=>{
    let projects=indexValueHandler.getAllProjects()

    
    let valuesBool
    editMode? valuesBool=getValueOfTaskEdit(taskBeingEdited,projects):valuesBool=getValueOfTask(projects)
    console.log(valuesBool);
    if (valuesBool) {
        taskTitle.value=""
        taskDate.value=""
        closeTaskDialog(projects)
    }
})
    displaySideBarThings(indexValueHandler.getAllProjects())    

    homeProjectSim(indexValueHandler.getAllTasks(),indexValueHandler.getAllProjects())
    homeProject.addEventListener("click",()=>{
        currentProjectId=0
        homeProjectSim(indexValueHandler.getAllTasks(),indexValueHandler.getAllProjects())
    })
    todayProject.addEventListener("click",()=>{
    currentProjectId=0
        const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    let todayTasks = indexValueHandler.getAllTasks().filter(
        task => task.getTask().dueDate === todayString
    );
    todayProjectSim(todayTasks, indexValueHandler.getAllProjects());
});
    closeDialog.addEventListener("click",()=>{
     taskDialog.close()
        taskTitle.value=""
        taskDate.value=""
    })
}

export const getValueOfTask=(projects)=>{
    const selected = document.querySelector('input[name="priority"]:checked');
    let el =projects.find(el=>el.id === currentProjectId)
    
    let title= taskTitle.value.trim()
    let taskDateValue= taskDate.value
    let prioritySelected=selected? selected.value:""
    
    if(title=="" || taskDateValue=="" ||  prioritySelected=="") return false
    console.log({title,taskDateValue,prioritySelected})
    el.setTask(title,taskDateValue,prioritySelected)
    console.log(currentProjectId);
    let current =projects.find(el=>el.id === currentProjectId)
    userClassH1.textContent=`${current.name}`
    throwAlertCreated(el.name,true)
    return true
}
export const getValueOfTaskEdit=(task,projects)=>{
    const selected = document.querySelector('input[name="priority"]:checked');
    let el =projects.find(el=>el.id === currentProjectId)
    
    let title= taskTitle.value.trim()
    let taskDateValue= taskDate.value
    let prioritySelected=selected? selected.value:""
    let currentTask=task.getTask()
    if(title=="" || taskDateValue=="" ||  prioritySelected=="") return false
    console.log({title,taskDateValue,prioritySelected})
    task.editTask(currentTask.id,currentTask.classId,title,taskDateValue,prioritySelected,currentTask.projectName,currentTask.confirm)
    throwAlertCreated(el.name,false)
    editMode=false
    taskBeingEdited=""
    return true
}
const throwAlertCreated=(name,isTask)=>{
    if(isTask) taskPopup.textContent=`Task added in project ${name}`
    else taskPopup.textContent=`Task edited in project ${name}`
    setTimeout(()=>{
            taskPopup.classList.toggle("not-shown")        
    },2000)
            taskPopup.classList.toggle("not-shown")        
    
}
export const showTaskDialog=()=>{
     taskDialog.showModal()
}
// id,classId,title,dueDate,priority,projectName,confirm}
export const showTaskDialogEdit=(task,currentClass)=>{
    let taskCurrent=task.getTask()
    dialogProject.textContent=`Project: ${currentClass.name}`   
    showTaskDialog()
    let select= document.querySelector(`input[id="${taskCurrent.priority}"]`)
    select.checked=true
    taskTitle.value= taskCurrent.title
    taskDate.value = taskCurrent.dueDate
    

}
export const closeTaskDialog=(projects)=>{
     taskDialog.close()
    displaySideBarThings(projects)
    projectTasksDisplayHandler(projects)
}