import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import './Stats.css';

const Stats: React.FC = () => {
  const { user } = useAuth();
  const [co2Saved, setCo2Saved] = useState(0);

  // fetch CO2 data from Firestore
  useEffect(() => {
    const fetchCO2Data = async () => {
      if (!user) return;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setCo2Saved(userDoc.data().co2Saved || 0);
      }
    };

    fetchCO2Data();
  }, [user]);

  // calculate equivalent stats based on CO2 saved
  const phoneCharges = (co2Saved / 0.005).toFixed(0); // Each phone charge produces about 0.005 kg CO2
  const carKmEquivalent = `${(co2Saved * 6).toFixed(1)} km`; // Average car emits about 167g CO2 per km

  return (
    <main className="stats-container" role="main" aria-labelledby="page-title">
      <h1 id="page-title">Your Environmental Impact</h1>
      
      <section className="stats-card total-saved" aria-labelledby="total-saved-title">
        <h2 id="total-saved-title">Total CO2 Saved</h2>
        <div className="co2-amount" aria-label="CO2 saved amount">{co2Saved.toFixed(2)} kg</div>
      </section>

      <section className="stats-grid" aria-labelledby="equivalents-title">
        <div className="stats-card">
          <h3 id="equivalents-title">Equivalent to</h3>
          <div className="equivalent" role="list">
            <div className="equivalent-item" role="listitem">
              <span className="number" aria-label="Number of phone charges">{phoneCharges}</span>
              <span className="label">full phone charges</span>
            </div>
            <div className="equivalent-item" role="listitem">
              <span className="number" aria-label="Distance driven">{carKmEquivalent}</span>
              <span className="label">driven by car</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Stats;
