import { database, auth } from '../firebaseConfig';
import * as Types from './firebaseTypes';


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
        todos: [],
        users: userId,
        name: projectName
    }
    const userRef = database.ref('users/' + userId + '/projects');

    const projectKey = database.ref().child('projects').push().key;
    database.ref('projects/' + projectKey).update({
        projectData
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            userRef.update({ projectKey })
        }
    });
}
