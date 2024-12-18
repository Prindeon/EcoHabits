import { useEffect, useState } from 'react';
import './TaskList.css';
import Task from '../Task/Task';
import { collection, query, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  taskDetails: {
    title: string;
    description: string;
    type: string;
    points: number;
    co2Factor: number; // Changed from co2factor to co2Factor
  };
  isCompleted: boolean;
  lastCompleted: string | null;
}
// TaskList component to display daily tasks and handle task completion
const TaskList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const dailyTasks = tasks.filter(task => task.taskDetails.type === 'daily');

  // fetch user tasks and points from Firestore
  useEffect(() => {
    if (!user) return;
    // fetch user points
    const fetchUserPoints = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserPoints(userDoc.data().points || 0);
      }
    };
    // reset daily tasks if not completed today
    const resetDailyTasks = async () => {
      const today = new Date().toLocaleDateString();
      tasks.forEach(async (task) => {
        if (task.taskDetails.type === 'daily' && task.lastCompleted !== today) {
          await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
            isCompleted: false,
            lastCompleted: null
          });
        }
      });
    };

    fetchUserPoints();
    resetDailyTasks();

    // fetch user tasks and update state
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const tasksQuery = query(tasksRef); // Remove the where clause temporarily
  
    // unsubscribe means to stop listening to changes in Firestore so that the app doesn't keep listening
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksList = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as Task;
      }); 
      console.log('Final tasks list:', tasksList); // checks the tasks list
      setTasks(tasksList);
    });
    // return unsubscribe function to stop listening when component unmounts
    return () => unsubscribe();
  }, [user]);

  // function to handle task completion and update user points accordingly
  const handleComplete = async (taskId: string, points: number) => {
    try {
      // Check if user is logged in
      if (!user) {
        console.error('No user found');
        return;
      }
      // Get today's date to update task completion
      const today = new Date().toLocaleDateString();
      
      // Get and verify task data
      const taskDoc = await getDoc(doc(db, 'users', user.uid, 'tasks', taskId));
      if (!taskDoc.exists()) {
        console.error('Task document not found');
        return;
      }
      // Get CO2 factor from task data to update user CO2 saved
      const taskData = taskDoc.data();
      const co2factor = taskData?.taskDetails?.co2Factor; 
      // error handling
      if (typeof co2factor !== 'number') {
        console.error('Invalid CO2 factor:', co2factor, 'for task:', taskId);
        return;
      }

      console.log('Task CO2 factor:', co2factor);

      // Update task completion so it doesn't show up as incomplete
      await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), {
        isCompleted: true,
        lastCompleted: today
      });

      // Get and verify user data to update points and CO2 saved
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      // error handling
      if (!userDoc.exists()) {
        console.error('User document not found');
        return;
      }
      // Get current user data to update points and CO2 saved
      const userData = userDoc.data();
      const currentPoints = userData.points || 0;
      const currentCO2Saved = userData.co2Saved || 0;

      // log to check current CO2 saved and CO2 factor
      console.log('Current CO2 saved:', currentCO2Saved);
      console.log('Adding CO2 factor:', co2factor);
      
      // Update user document with new points and CO2 saved
      const newCO2Saved = currentCO2Saved + co2factor;
      console.log('New CO2 saved will be:', newCO2Saved);

      // error handling
      try {
        await updateDoc(userRef, {
          points: currentPoints + points,
          co2Saved: newCO2Saved
        });
        console.log('Successfully updated user document with new CO2:', newCO2Saved);
      } catch (updateError) {
        console.error('Error updating user document:', updateError);
        throw updateError;
      }
      // Update user points
      setUserPoints(currentPoints + points);
    } catch (error) {
      console.error('Error in handleComplete:', error);
      alert('Error completing task. Please try again.');
    }
  };

  return (
    <main className="task-list-container" role="main">
      <div className="points-display" role="status" aria-live="polite">
        <h3>Total Points: {userPoints}</h3>
        <button 
          className="stats-button"
          onClick={() => navigate('/stats')}
          aria-label="View your CO2 impact statistics"
        >
          View CO2 Impact
        </button>
      </div>
      <section className="task-section" aria-labelledby="daily-tasks-title">
        <h2 id="daily-tasks-title">Daily Tasks</h2>
        <div className="tasks-grid" role="list">
          {dailyTasks.map((task) => (
            <div key={task.id} role="listitem">
              <Task
                key={task.id}
                id={task.id}
                title={task.taskDetails.title}
                description={task.taskDetails.description}
                type={task.taskDetails.type}
                points={task.taskDetails.points}
                completed={task.isCompleted}
                onComplete={handleComplete}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TaskList;