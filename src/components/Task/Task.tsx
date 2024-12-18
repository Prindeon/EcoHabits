import { useState } from 'react';
import './Task.css';

interface TaskProps {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: string;
  onComplete: (id: string, points: number) => void;
}

// Task component to display task details
const Task: React.FC<TaskProps> = ({ 
  id, title, description, points, completed, onComplete 
}) => {
  // State to toggle expanded view of task description for better readability
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article 
      className={`task-container ${completed ? 'completed' : ''}`}
      aria-label={title}
    >
      <div 
        className="task-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        <h3 id={`task-title-${id}`}>{title}</h3>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">▼</span>
      </div>
      <div 
        className={`task-description ${isExpanded ? 'expanded' : ''}`}
        aria-labelledby={`task-title-${id}`}
        role="region"
      >
        <p>{description}</p>
      </div>
      <div className="task-actions">
        <button 
          onClick={() => onComplete(id, points)} 
          disabled={completed}
          className="complete-btn"
          aria-label={`${completed ? 'Task completed' : 'Complete task'}: ${title}`}
        >
          {completed ? 'Completed' : 'Complete'}
        </button>
      </div>
    </article>
  );
};

export default Task;