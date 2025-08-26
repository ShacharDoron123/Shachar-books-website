import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllBooks from './pages/AllBooks';
import About from './pages/About';
import { Layout } from '../Layout';
import BookInfo from './pages/BookInfo';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './components/Logout';

function App() {
  return(
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/AllBooks" element={<AllBooks/>}/>
          <Route path="/About" element={<About/>}/>
          <Route path="/BookInfo" element={<BookInfo />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="logout" element={<Logout/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
