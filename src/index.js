import "./styles.css"
import {giveEventListnersToDialog,showTaskDialog,displaySideBarThings} from "./display"

const inputProject=document.getElementById("input-project")

const indexValueHandler=( function (){
    let allProjects=[]

    let taskCurrentIndex=0
    let projectCurrentIndex=0

    
    const getThingsFromLocalStorage = () => {
    const storedProjects = localStorage.getItem("allProjects");
    if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        
        allProjects = parsedProjects.map(proj => {
            // Recreate Projects instance
            const project = new Projects(proj.id, proj.name);
            // Recreate each task as a createTask object
            project.tasks = proj.tasks.map(taskObj =>
                createTask(
                    taskObj.projectName,
                    taskObj.classId,
                    taskObj.title,
                    taskObj.dueDate,
                    taskObj.priority,
                    taskObj.id,
                    taskObj.confirm,
                )
            );
            // Restore confirm state if present
            project.tasks.forEach((task, i) => {
                if (proj.tasks[i].confirm) {
                    // Set confirm to true if it was true in storage
                    task.getTask().confirm = true;
                }
            });
            return project;
        });
            taskCurrentIndex=JSON.parse(localStorage.getItem("taskCurrentIndex"))
            projectCurrentIndex=JSON.parse(localStorage.getItem("projectCurrentIndex"))

    }
    }
    const setThingsToLocalStorage=()=>{
    const plainProjects = allProjects.map(project => ({
        id: project.id,
        name: project.name,
        tasks: project.tasks.map(task => task.getTask())
    }));
    localStorage.setItem("allProjects", JSON.stringify(plainProjects));
    localStorage.setItem("taskCurrentIndex", JSON.stringify(taskCurrentIndex));
    localStorage.setItem("projectCurrentIndex", JSON.stringify(projectCurrentIndex));

    }
   

    // Creating the tasks/projects while incrementing the index
    const pushTask=()=>{
        taskCurrentIndex+=1
        setThingsToLocalStorage()
    }

    
    const pushProject=(createdProject)=>{
        allProjects.push(createdProject)
        projectCurrentIndex+=1
        setThingsToLocalStorage()

    }
    
    
    const deleteTask=(id,classId)=>{
        let classCurrent= allProjects.find(p=> p.id === classId) 
        classCurrent.deleteTaskClass(id)
        setThingsToLocalStorage()

    }


    const deleteProject=(classId)=>{
        let indexProject=allProjects.findIndex(p=>p.id === classId)    
        allProjects.splice(indexProject,1)
                setThingsToLocalStorage()

        // setProjectToLocalStorage()
    }


    const getTaskIndex=()=> taskCurrentIndex
    const getProjectIndex=()=> projectCurrentIndex

    const getAllProjects= ()=> {
        // getThingsFromLocalStorage()
        return allProjects}
    const getAllTasks=()=> {
        // getThingsFromLocalStorage()
        let allTasks=[]
        allProjects.forEach((el)=> {
            el.tasks.forEach((task)=>{
                allTasks.push(task)
            })
        })
        return allTasks
    }

    const taskGiver=(id)=>{
        let indexProject=allProjects.findIndex(p=>p.id === id)    
        allProjects[indexProject].setTask()
    }

    return {deleteProject,deleteTask,getAllTasks,taskGiver,getThingsFromLocalStorage,setThingsToLocalStorage,pushProject,pushTask,getTaskIndex,getProjectIndex,getAllProjects}
    
    
})()
class Projects{
    constructor(id,name){
        this.id=id
        this.name=name
        this.tasks=[]
          
    }
    setTask(title,taskDateValue,prioritySelected){
        //MAKE THE CLASS ID BE PUT IN FROM THE SETTASK AND SO FOR THE OTHER VARIABLES U PASS TO CREATETASK

        let createdTask=createTask(this.name,this.id,title,taskDateValue,prioritySelected)
        this.tasks.push(createdTask)
        
        indexValueHandler.pushTask()
    }
    deleteTaskClass(id){
        let indexTask=this.tasks.findIndex(t=>t.getTask().id === id)    
        this.tasks.splice(indexTask,1)
    }
    logTasks(){
        this.tasks.forEach((task)=>{
            console.log(task.getTask())
        })
    }
    deleteThisProject(){
        if(this.tasks.length != 0) return
        indexValueHandler.deleteProject(this.id)
    }
    filterTasksFinished(){
        this.tasks=this.tasks.sort((a,b)=> {
            if(a.getTask().confirm==b.getTask().confirm) return 0
            return a.getTask().confirm ? 1:-1 
        })
    }
    filterTasksOnPriority() {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    this.tasks = this.tasks.sort((a, b) => {
        const aPriority = priorityOrder[a.getTask().priority];
        const bPriority = priorityOrder[b.getTask().priority];
        return aPriority - bPriority;
    });
}
}


function createTask(projectName,classId,title,dueDate,priority,id=indexValueHandler.getTaskIndex(),confirm=false){ 

    let obj={id,classId,title,dueDate,priority,projectName,confirm}
    const getTask=()=> {return obj}

    const editTask=(id,classId,title,dueDate,priority,projectName,confirm)=> {
        obj={id,classId,title,dueDate,priority,projectName,confirm}
        indexValueHandler.setThingsToLocalStorage()

    }
    
    const completeTask=()=> {
        console.log(obj.confirm);
        obj.confirm= !obj.confirm
        indexValueHandler.setThingsToLocalStorage()
    }

    const deleteTask=()=>{
        indexValueHandler.deleteTask(id,classId)
    }
    return {getTask,editTask,deleteTask,completeTask}
}

function createProject(name){
    console.log(indexValueHandler);
    
    let id= indexValueHandler.getProjectIndex()
    console.log(id);
    
    indexValueHandler.pushProject(new Projects(id,name))
}

(function(){
    if(localStorage.getItem("allProjects") === null) {
    createProject("Home")
    createProject("Work")
    let project=indexValueHandler.getAllProjects()
    project[0].setTask("Get dressed!","2025-05-25","low")
    project[0].setTask("Dont get dressed!","2024-02-02","medium")
    project[0].setTask("Buy groceries","2024-07-01","high")
    project[0].setTask("Read a book","2024-08-15","medium")
    project[0].setTask("Clean the house","2024-09-10","low")
    project[0].setTask("Exercise","2024-10-05","high")
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    
    project[1].setTask("Go to work and work!",`${todayString}`,"high")
    project[1].setTask("Team meeting","2024-09-12","medium")
    project[1].setTask("Submit timesheet","2024-10-07","low")
    project[1].setTask("Finish project report","2024-08-20","high")
}else{
    indexValueHandler.getThingsFromLocalStorage()
}
 giveEventListnersToDialog(indexValueHandler)

} )()


document.getElementById("add-task").addEventListener("click",()=>{
    showTaskDialog()
    

})

document.getElementById("add-project").addEventListener("click",()=>{
    let inputForNewProject=inputProject.value.trim()
    if(inputForNewProject==="") return
    createProject(inputForNewProject,inputForNewProject)
    displaySideBarThings(indexValueHandler.getAllProjects())
    inputProject.value=""

})


