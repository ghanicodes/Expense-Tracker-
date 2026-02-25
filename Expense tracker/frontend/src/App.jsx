import React from 'react'
import {  
 BrowserRouter as Router,
 Routes,
 Route,
 Navigate,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from "./pages/Dashboard/Home";
import AddIncome from "./pages/Dashboard/AddIncome";
import Expense from "./pages/Dashboard/Expense";


const App = () => {
  return (
    <div>
    <Router>
    <Routes>
      <Route path='/' element={<Root />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/signUp' exact element={<SignUp />} />
      <Route path='/dashboard' exact element={<Home />} />
      <Route path='/addIncome' exact element={<AddIncome />} />
      <Route path='/expense' exact element={<Expense />} />

      </Routes>      
    </Router>

    </div>
  )
}

export default App

const Root = ()=>{
  // Check if token exists in localStorage  
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to Dashboard if Authenticated, other wise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};