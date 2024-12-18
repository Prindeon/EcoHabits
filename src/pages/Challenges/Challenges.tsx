import { useEffect, useState } from 'react';
import './Challenges.css';
import Task from '../../components/Task/Task';
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
    co2Factor: number;
  };
  isCompleted: boolean;
  lastCompleted: string | null;
}
// Challenges component to display challenge tasks and handle task completion
const Challenges: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();
  const challenges = tasks.filter(task => task.taskDetails.type === 'challenge');

  // fetch user tasks and points from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchUserPoints = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserPoints(userDoc.data().points || 0);
      }
    };

    fetchUserPoints();

    // fetch user tasks and update state 
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const tasksQuery = query(tasksRef);
    
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, [user]);

  // function to handle task completion and update user points accordingly
  const handleComplete = async (taskId: string, points: number) => {
    try {
      if (!user) {
        console.error('No user found');
        return;
      }
      // Get today's date for lastCompleted field
      const today = new Date().toLocaleDateString();
      
      // Get and verify task data
      const taskDoc = await getDoc(doc(db, 'users', user.uid, 'tasks', taskId));
      if (!taskDoc.exists()) {
        console.error('Task document not found');
        return;
      }

      // Get CO2 factor from task data and verify it's a number
      const taskData = taskDoc.data();
      const co2factor = taskData?.taskDetails?.co2Factor; 
      if (typeof co2factor !== 'number') {
        console.error('Invalid CO2 factor:', co2factor, 'for task:', taskId);
        return;
      }

      console.log('Task CO2 factor:', co2factor);

      // Update task document with completion
      await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), {
        isCompleted: true,
        lastCompleted: today
      });

      // Get user document and verify it exists
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error('User document not found');
        return;
      }

      const userData = userDoc.data();
      const currentPoints = userData.points || 0;
      const currentCO2Saved = userData.co2Saved || 0;

      // Update user document with new points and CO2 saved
      try {
        await updateDoc(userRef, {
          points: currentPoints + points,
          co2Saved: currentCO2Saved + co2factor
        });
      } catch (updateError) {
        console.error('Error updating user document:', updateError);
        throw updateError;
      }

      // Update state with new user points
      setUserPoints(currentPoints + points);
    } catch (error) {
      console.error('Error in handleComplete:', error);
      alert('Error completing task. Please try again.');
    }
  };

  return (
    <div className="challenges-container">
      <div className="points-display">
        <h3>Total Points: {userPoints}</h3>
        <button 
          className="stats-button"
          onClick={() => navigate('/stats')}
        >
          View CO2 Impact
        </button>
      </div>
      <section className="task-section">
        <h2>Challenges</h2>
        <div className="tasks-grid">
          {challenges.map((task) => (
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Challenges;