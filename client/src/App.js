import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import './App.css';

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">Home</a>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="/summoners">Summoners<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={e => setSearch(e.target.value)}/>
            <Link to={{ pathname: `/summoners/${search}` }}>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </Link>
          </form>
        </nav>

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/summoners">
            <Route index element={<Summoners />}></Route>
            <Route path=":summonerName" element={<Summoners />}></Route>
          </Route>
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
  const [summoner, setSummoner] = useState({});
  const [search, setSearch] = useState("");
  const { summonerName } = useParams();

  useEffect(() => {
    if (typeof summonerName != "undefined") {
      fetch(`/api/user/${summonerName}`)
      .then(res => res.json())
      .then(data => {
        setSummoner(data);
        console.log(data);
      });
    }
  }, [summonerName]);

  function updateUser() {
    fetch(`/api/user/update/${summoner.summonerID}`)
      .then(res => res.json())
      .then(data => {
        setSummoner(data);
      })
  }

  // updateUser(() => {
  //   fetch(`/api/user/update/${summoner.summonerID}`)
  //   .then(res => res.json())
  //   .then(data => {
  //     setSummoner(data);
  //   })
  // })

  return (
    <div className="search-screen">
      <div>
        <h1 id="search-header">Search Summoners</h1>
        <form className="form-inline my-2 my-lg-0">
          <label>Summoner Name: </label>
          <input className="form-control mr-sm-2" type="text" name="name" placeholder="Search User" onChange={e => setSearch(e.target.value)}/>
          <Link to={{pathname: `/summoners/${search}`}}>
            <button className="btn btn-outline-success my-2 my-sm-0">Submit</button>
          </Link>
        </form>
        <div className="summoner-info">
          <button onClick={updateUser} className="btn btn-outline-success my-2 my-sm-0">Update</button>
          <p>Summoner: {summoner.summonerName}</p>
          <p>Level: {summoner.summonerLevel}</p>
          <p>Rank: {summoner.tier} {summoner.rank}</p>
          <p>LP: {summoner.leaguePoints}</p>
          <p>Wins: {summoner.wins}</p>
          <p>Losses: {summoner.losses}</p>
        </div>
      </div>
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
