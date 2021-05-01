import { database, auth } from '../firebaseConfig';
import * as Types from './firebaseTypes';

interface IaddTask {
    projectKey: string;
    column: string;
    name: string;
}

interface Itask {
    name: string;
    order: number;
    owner: string;
    [key: string]: any;
}

export const initUserData = (userData: Types.initUserType) => {
    const { userId, email, displayName } = userData;
    database.ref('users/' + userId).set({
        email: email,
        displayName: displayName,
        projects: []
    });
}

export const addNewProject = async (projectName: string) => {
    const userId = auth.currentUser!.uid;
    const projectData: Types.projectDataType = {
        users: userId,
        name: projectName,
        columns: {
            new: {
                id: 'new', title: 'לעשות', taskIds: []
            },
            doing: {
                id: 'doing', title: 'בעשייה', taskIds: []
            },
            done: {
                id: 'done', title: 'נעשה', taskIds: []
            },
            columnOrder: ['new', 'doing', 'done']
        },
    }

    const userRef = database.ref('users/' + userId + '/projects');
    const projectKey = database.ref().child('projects').push().key;

    await database.ref('projects/' + projectKey).update({
        ...projectData
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            addTask({ projectKey: projectKey!, column: 'new', name: 'הוסף משימה ראשונה' });
            userRef.child(projectKey!).set(projectName);
        }
    });
    return projectKey;
}

export const addTask = async ({ projectKey, column, name }: IaddTask) => {
    const userId = auth.currentUser!.uid!;
    const newTaskId = database.ref('projects/' + projectKey + '/tasks').push().key
    database.ref('projects/' + projectKey + '/tasks/' + newTaskId).update({ id: newTaskId, name: name, owner: userId })

    const getTasks = await database.ref('projects/' + projectKey + '/columns/' + column + '/taskIds').get().then((snapshot: any) => {
        if (snapshot.exists()) {
            const allTasks = snapshot.val()
            console.log("allTasks", allTasks)
            allTasks.push(newTaskId)
            return allTasks;
        }
        return [newTaskId]
    }).catch(err => {
        console.log(err);
    })
    console.log("stop this", getTasks)
    database.ref('projects/' + projectKey + '/columns/' + column).child('taskIds').set(getTasks)

}

export const getProjectsRef = () => {
    const userId = auth.currentUser!.uid;
    const userProjectsRef = database.ref('users/' + userId);
    return userProjectsRef;
}

export const getSelectProjectRef = (projectKey: string) => {
    const projectsRef = database.ref('projects/' + projectKey);
    return projectsRef;
}

export const deleteTask = (projectKey: string, columnId: string, taskId: string, newTaskIds: string[]) => {

    const tasksTodoRef = database.ref(`projects/${projectKey}/tasks/${taskId}`);
    tasksTodoRef.remove()
    database.ref(`projects/${projectKey}/columns/${columnId}/taskIds`).set(newTaskIds)
}

export const reorderTasksColumns = (projectKey: string, startColumnName: string, endColumnName: string, startColumn: any, endColumn: any) => {
    const updates = {
        [`projects/${projectKey}/columns/${startColumnName}/taskIds`]: startColumn,
        [`projects/${projectKey}/columns/${endColumnName}/taskIds`]: endColumn,
    }
    console.log("changeded columns");

    database.ref().update(updates)
}

export const reorderTasks = (projectKey: string, columnName: string, tasks: any) => {

    database.ref(`projects/ ${projectKey}/columns/${columnName}/taskIds`).update(tasks)
}

export const initTasksOrder = (projectKey: string, column: string, tasks: any): Itask[] => {
    console.log("tasks", tasks);
    const sortedTodos = Object.keys(tasks)
        .sort((a, b) => {
            return tasks[a].order - tasks[b].order;
        })
        .map((taskId: string) => {
            return { [taskId]: tasks[taskId] };
        });
    console.log("sortedTodos", sortedTodos);

    database.ref('projects/' + projectKey + '/todos').child(column).update(tasks)
    return sortedTodos as Itask[];
}