
import { Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import { Switch } from 'antd';

const App = () => {
  return (
    <Router>
      <Switch>
        <Routes path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;