import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SpeedsBriefingGenerator } from './generators/SpeedsBriefingGenerator';
import { WeightAndBalanceGenerator } from './generators/WeightAndBalanceGenerator';
import { EmergencyChecklistGenerator } from './generators/EmergencyChecklistGenerator';
import { CFIEndorsementsGenerator } from './generators/CFIEndorsementsGenerator';
import FlightPlanGenerator from './generators/FlightPlanGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/speeds-briefing" element={<SpeedsBriefingGenerator />} />
        <Route path="/weight-balance" element={<WeightAndBalanceGenerator />} />
        <Route path="/emergency" element={<EmergencyChecklistGenerator />} />
        <Route path="/cfi-endorsements" element={<CFIEndorsementsGenerator />} />
        <Route path="/flight-plan" element={<FlightPlanGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
