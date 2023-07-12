import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './FirebaseConfig'
import Login from './components/Login/Login'
import Homepage from './components/Homepage/Homepage'
import RegisterForm from './components/Register/Register'
import Header from './components/Header/Header'
import './App.css'

import "primereact/resources/themes/saga-blue/theme.css"

function App() {

  const [userData, setUserData] = useState<User | null>()

  onAuthStateChanged(auth, (user) => {
    setUserData(user)
  })

  return (
    <>
      <Router>
        <div className="app">
          <Header isLogged={!!userData} />
          <Routes>
            <Route
              path='/'
              /*  element={isLogged ? <Homepage /> : <Login onLogin={setAppUser} />} */
              element={userData ? <Homepage /> : <Login />}
            />
            <Route
              path='/register'
              element={<RegisterForm />}
            />
          </Routes>
        </div>
      </Router>

    </>
  )
}

export default App
