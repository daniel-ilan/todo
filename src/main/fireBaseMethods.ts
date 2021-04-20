import { database, auth } from '../firebaseConfig';
import * as Types from './firebaseTypes';
interface IaddTask {
    projectKey: string;
    board: string;
    name: string;
}

export const initUserData = (userData: Types.initUserType) => {
    const { userId, email, displayName } = userData;
    database.ref('users/' + userId).set({
        email: email,
        displayName: displayName,
        projects: []
    });
}

export const addNewProject = (projectName: string) => {
    const userId = auth.currentUser!.uid;

    const projectData: Types.projectDataType = {
        users: userId,
        name: projectName,
        todos: {
            new: {
            },
            doing: {
            },
            done: {
            }
        }
    }
    const userRef = database.ref('users/' + userId + '/projects');

    const projectKey = database.ref().child('projects').push().key;
    database.ref('projects/' + projectKey).update({
        ...projectData
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            addTask({ projectKey: projectKey!, board: 'new', name: 'הוסף משימה ראשונה' });
            userRef.child(projectKey!).set(projectName);
        }
    });
}

export const addTask = ({ projectKey, board, name }: IaddTask) => {
    const userId = auth.currentUser!.uid!;
    database.ref('projects/' + projectKey + '/todos').child(board).push({ name: name, owner: userId })
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

export const deleteTask = (projectKey: string, card: string, taskId: string) => {
    console.log("projectKey", projectKey)
    console.log("card", card)
    console.log("taskId", taskId)
    const projectTodoRef = database.ref(`projects/${projectKey}/todos/${card}/${taskId}`);
    projectTodoRef.remove()
}