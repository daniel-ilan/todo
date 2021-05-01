import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';

const useKanban = (userId: string, projectId: string) => {
  const [tasks, setTasks]: any = useState(null);
  const [columns, setColumns]: any = useState(null);
  const [final, setFinal] = useState<null | any>(null);
  const [boardName, setBoardName] = useState('');
  console.log('enter kanban');

  useEffect(() => {
    if (!projectId) {
      return;
    }
    database.ref(`projects/${projectId}/tasks`).on('value', (snapshot) => {
      const documents: any[] = [];

      Object.keys(snapshot.val()).forEach((taskKey: string) => {
        documents.push({ ...snapshot.val()[taskKey] });
      });
      return setTasks(documents);
    });
  }, [userId, projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    database
      .ref(`projects/${projectId}`)
      .get()
      .then((snapshot) => setBoardName(snapshot.val().name));
  }, [userId, projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    database.ref(`projects/${projectId}/columns`).on('value', (snapshot) => {
      const documents: any[] = [];

      Object.keys(snapshot.val()).forEach((columnKey: any) => {
        documents.push({ id: columnKey, ...snapshot.val()[columnKey] });
      });
      setColumns(documents);
    });
  }, [userId, projectId]);

  useEffect(() => {
    if (tasks && columns) {
      const finalObject: any = {};

      const columnOrder = columns.find((c: any) => c.id === 'columnOrder');
      const cols = columns.filter((c: any) => c.id !== 'columnOrder');

      finalObject.columnOrder = Object.values(columnOrder).filter((colName: any) => colName !== 'columnOrder');
      finalObject.columns = {};
      finalObject.tasks = {};

      tasks.forEach((t: any) => (finalObject.tasks[t.id] = t));
      cols.forEach((c: any) => (finalObject.columns[c.id] = c));

      setFinal(finalObject);
    }
  }, [tasks, columns]);

  return { initialData: final, setInitialData: setFinal, boardName };
};

export default useKanban;
