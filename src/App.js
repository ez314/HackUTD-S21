import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { Home } from './Home';
import { About } from './About';
import { NoMatch } from './NoMatch';
import Sidebar from './components/Sidebar';


function App() {
    return ( <
        React.Fragment >
        <
        Router >
        <
        Switch >
        <
        Route exact path = "/"
        component = { Home }
        />  <
        Route path = "/about"
        component = { About }
        />  <
        Route component = { NoMatch }
        />  <
        /Switch>  <
        NavigationBar / >
        <
        Sidebar / >
        <
        /Router>  <
        /React.Fragment>
        // <div className="text-center p-4">
        //  <h1 className="text-3xl">Rectangle</h1>
        // </div>
    );
}

export default App;