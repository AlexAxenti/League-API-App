import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import meme from './assets/TeemoMeme.jpg';
import pepe from './assets/TeemoPepe.jpg';
import irl from './assets/TeemoIRL.jpg';
import emote from './assets/TeemoEmote.webp';
import axios from 'axios';
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
          <Route path="/captain/teemo/on/duty" element={<Teemo />}></Route>
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
  const { summonerName } = useParams();

  const [summoner, setSummoner] = useState({});
  const [liveGame, setLiveGame] = useState({});
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    if (typeof summonerName != "undefined") {
      fetch(`/api/summoner/${summonerName}`)
      .then(res => res.json())
      .then(data => {
        setSummoner(data);
        console.log(data);
      });
    }
  }, [summonerName]);

  const updateSummoner = () => {
    axios.get(`/api/summoner/${summoner.summonerName}/update`)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          setSummoner(res.data);
        }
      })
      .catch(err => {
        let res = err.response;
        if (res.status === 429) {
          console.log(res.data);
        } else if (res.status === 404) {
          console.log(res.data);
        } else {
          console.log(err)
        }
      })
  }

  const getLiveGame = () => {
    axios.get(`/api/summoner/${summoner.summonerName}/ingame`)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          setLiveGame(res.data);
        }
      })
      .catch(err => {
        //let res = err.response;
        console.log(err);
      })
  }

  return (
    <div className="search-screen">
      <div>
        <h1 id="search-header">Search Summoners</h1>
        <form className="form-inline my-2 my-lg-0">
          <label>Summoner Name: </label>
          <input className="form-control mr-sm-2" type="text" name="name" placeholder="Search Summoner" onChange={e => setSearch(e.target.value)}/>
          <Link to={{pathname: `/summoners/${search}`}}>
            <button className="btn btn-outline-success my-2 my-sm-0">Submit</button>
          </Link>
        </form>
        <div className="summoner-info">
          <button onClick={updateSummoner} className="btn btn-outline-success my-2 my-sm-0">Update</button>
          <p>Summoner: {summoner.summonerName}</p>
          <p>Level: {summoner.summonerLevel}</p>
          <p>Rank: {summoner.tier} {summoner.rank}</p>
          <p>LP: {summoner.leaguePoints}</p>
          <p>Wins: {summoner.wins}</p>
          <p>Losses: {summoner.losses}</p>
        </div>
        <div className="live-game-container">
          <button onClick={getLiveGame} className="btn btn-outline-success my-2 my-sm-0">Live Game</button>
          
          {Object.keys(liveGame).length === 0 ? <div></div> : 
          <ul>
            <p>Blue Team</p>
            <li>{liveGame.bluePlayers[0].summonerName} {liveGame.bluePlayers[0].championID}</li>
            <li>{liveGame.bluePlayers[1].summonerName} {liveGame.bluePlayers[1].championID}</li>
            <li>{liveGame.bluePlayers[2].summonerName} {liveGame.bluePlayers[2].championID}</li>
            <li>{liveGame.bluePlayers[3].summonerName} {liveGame.bluePlayers[3].championID}</li>
            <li>{liveGame.bluePlayers[4].summonerName} {liveGame.bluePlayers[4].championID}</li>
            <p>Red Team</p>
            <li>{liveGame.redPlayers[0].summonerName} {liveGame.redPlayers[0].championID}</li>
            <li>{liveGame.redPlayers[1].summonerName} {liveGame.redPlayers[1].championID}</li>
            <li>{liveGame.redPlayers[2].summonerName} {liveGame.redPlayers[2].championID}</li>
            <li>{liveGame.redPlayers[3].summonerName} {liveGame.redPlayers[3].championID}</li>
            <li>{liveGame.redPlayers[4].summonerName} {liveGame.redPlayers[4].championID}</li>
          </ul>}
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

function Teemo() {
  return (
    <div>
      <img src={irl} alt="" />
      <img src={pepe} alt="" />
      <img src={meme} alt="" />
      <img src={emote} alt="" />
    </div>
  )
}