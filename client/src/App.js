import './App.css';
import Dashboard from './modules/dashboard/Dashboard';
import UserCard from './modules/dashboard/UserCard';
import SignUp from './modules/form/SignUp';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route exact path="/" element={<SignUp />}/>
        <Route exact path="/dashboard/:id" element={<Dashboard/>}/>
      </Routes>
    </Router>
  </div>
  );
}

export default App;