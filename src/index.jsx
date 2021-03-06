import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GlobalStyle from './utils/style/GlobalStyle'

import Home from './pages/Home'
import Survey from './pages/Survey'
import Header from "./components/Header"
import Error from './pages/Error'
import Results from './pages/Results'
import Freelances from './pages/Freelances'
import Profile from './pages/Profile'
import Footer from './components/Footer'
import { SurveyProvider, ThemeProvider } from './utils/context'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <SurveyProvider>
          <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/survey/:questionNumber" element={<Survey />} />
            <Route path="/results" element={<Results />} />
            <Route path="/freelances" element={<Freelances />} />
            <Route path="/profile/:id" element={<Profile />} render={props => <Profile {...props} />} />
            <Route path="*" element={<Error />} />
          </Routes>
          <Footer />
        </SurveyProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
