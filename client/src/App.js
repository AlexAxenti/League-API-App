import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/summoners">Summoners</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/summoners" element={<Summoners />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

function Summoners() {
  const [summoner, setSummoner] = useState({user: '', rank: ''});

  useEffect(() => {
    fetch("/api/user")
    .then(res => res.json())
    .then(data => setSummoner(data));
  }, []);

  return (
    <div>
      <h1>Summoners</h1>
      <p>{summoner.user}</p>
      <p>{summoner.rank}</p>
    </div>
  )
}

function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { apiResponse: "" };
//   }

//   callAPI() {
//     fetch("/api/user")
//       .then(res => res.text())
//       .then(res => this.setState({ apiResponse: res }));
//   }

//   componentDidMount() {
//     this.callAPI();
//   }

//   render() {
//     return (
//       <Router>
//         <div className="App">
//           <header className="App-header">
//             <nav>
//               <ul>
//                 <li><a href="/">Home</a></li>
//                 <li><a href="/summoners">Summoners</a></li>
//                 <li><a href="/info">Info</a></li>
//               </ul>
//             </nav>
//             <img src={logo} className="App-logo" alt="logo" />
//             <h1 className="App-title">Welcome to React</h1>
//             <p className="App-intro">
//               {this.state.apiResponse}
//             </p>
//             <Route path="/" component={Home} />
//           </header>
//         </div>
//       </Router>
//     );
//   }
// }

// export default App;