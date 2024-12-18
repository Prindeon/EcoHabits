import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import './TaskForm.css';


// I decided to change my approach and emit the functionality to create custom tasks for the sake of simplicity.
// So this page will stay unused.


const TaskForm: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('daily');

  // Function to handle form submission and save task to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // Task data to save to Firestore
    const taskData = {
      title,
      description,
      type,
      points: 10, 
      isActive: true,
      createdAt: new Date().toISOString(),
      completed: false,
      lastCompleted: null
    };
    // Save task to Firestore using addDoc
    try {
      console.log('Saving task to Firestore');
      // collection reference to use subcollection
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const docRef = await addDoc(tasksRef, taskData);
      console.log('Task saved successfully:', docRef.id);
      
      // Reset form
      setTitle('');
      setDescription('');
      setType('daily');
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="challenge">Challenge</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;