
import React from 'react';
import './About.css';

// About page to display information about EcoHabits
const About: React.FC = () => {
  return (
    <div className="about-container">
      <h2>About EcoHabits</h2>
      <section className="about-content">
        <h3>Our Mission</h3>
        <p>
          At EcoHabits, we believe that small actions can lead to big changes. Our platform is designed 
          to help individuals develop sustainable habits that collectively make a significant impact on 
          our planet's health.
        </p>

        <h3>Why Sustainability Matters</h3>
        <p>
          Climate change and environmental degradation are among the biggest challenges of our time. 
          By making sustainable choices in our daily lives, we can reduce our carbon footprint, 
          conserve natural resources, and create a better future for generations to come.
        </p>

        <h3>How EcoHabits Helps</h3>
        <p>
          Our platform offers various challenges and tracks your progress as you adopt eco-friendly 
          habits. Through gamification and community engagement, we make sustainability fun and 
          achievable. Each challenge you complete contributes to a larger movement of positive 
          environmental change.
        </p>
      </section>
    </div>
  );
};

export default About;