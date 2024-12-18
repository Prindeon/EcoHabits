import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import defaultTasks from '../data/defaultTasks.json';

//the purpose of this function is to assign default tasks to a user if they have no tasks, i.e. when they first sign up
export const assignDefaultTasks = async (userId: string) => {
  try {
    // Reference to user's tasks subcollection to check if user has tasks
    const userTasksRef = collection(db, 'users', userId, 'tasks');
    const querySnapshot = await getDocs(userTasksRef);

    // If user has no tasks, assign defaults
    if (querySnapshot.empty) {
      // Create tasks in the nested collection
      await Promise.all(defaultTasks.defaultTasks.map(async (task, index) => {
        const taskDoc = doc(userTasksRef, `task${index + 1}`);
        await setDoc(taskDoc, {
          taskDetails: task,
          isCompleted: false,
          lastCompleted: null
        });
      }));

      console.log('Default tasks assigned to user');
    }
    // error handling
  } catch (error) {
    console.error('Error assigning default tasks:', error);
  }
};