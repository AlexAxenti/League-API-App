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
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div className="progress-background"></div>
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

function startLoader(current, max) {
  var bar = document.querySelector(".progress-bar");
  document.querySelector(".progress-background").style.display = "none";
  document.querySelector(".progress").style.display = "flex";
  setTimeout(() => increaseLoader(bar, current, max), 100);
}

function increaseLoader(bar, value, max) {
  bar.style.width = value + "%";
  console.log(value);
  if (value + 10 <= max) {
    console.log("ways?");
    setTimeout(() => increaseLoader(bar, value + 10, max), 75);
  }
  if (value == 100) {
    setTimeout(() => {
      document.querySelector(".progress").style.display = "none";
      document.querySelector(".progress-background").style.display = "block";
      bar.style.width = 0 + "%";
    }, 1000);
    
  }
}

function Summoners() {
  const { summonerName } = useParams();

  const [summoner, setSummoner] = useState({});
  const [liveGame, setLiveGame] = useState({});
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    setSummoner({});
    setLiveGame({});
    if (typeof summonerName != "undefined") {
      startLoader(0, 50);
      axios.get(`/api/summoner/${summonerName}`)
        .then(res => {
          setSummoner(res.data);
          startLoader(50, 100);
        })
        .catch(err => {
          let res = err.response;
          if (res.status === 503) {
            alert("Server receiving too many requests, try again later.")
          } else if (res.status === 404) {
            alert("User does not exist");
          } else {
            console.log(err);
          }
          console.log(res);
          startLoader(50, 100);
        })
    }
  }, [summonerName]);

  const updateSummoner = () => {
    startLoader(0, 50);
    axios.get(`/api/summoner/${summoner.summonerName}/update`)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          setSummoner(res.data);
        }
        startLoader(50, 100);
      })
      .catch(err => {
        let res = err.response;
        if (res.status === 429) {
          let timeUntilAvailable = 90 - res.data.timeSinceUpdate;
          alert("Updated too recently, available in " + timeUntilAvailable + " seconds.");
        } else if (res.status === 404) {
          alert("Summoner not found.");
        } else if (res.status === 503) {
          alert("Server receiving too many requests, try again later.")
        } else {
          console.log(err)
        }
        console.log(res);
        startLoader(50, 100);
      })
  }

  const getLiveGame = () => {
    startLoader(0, 50);
    axios.get(`/api/summoner/${summoner.summonerName}/ingame`)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          setLiveGame(res.data);
        }
        startLoader(50, 100);
      })
      .catch(err => {
        let res = err.response;
        if (res.status === 503) {
          alert("Server receiving too many requests, try again later.")
        } else if (res.status === 404) {
          alert("User is currently not ingame");
        } else {
          console.log(err);
        }
        console.log(res);
        startLoader(50, 100);
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
        {Object.keys(summoner).length === 0 
        ? 
        <div className="summoner-info">
          <p>Summoner: </p>
          <p>Level: </p>
          <p>Rank: </p>
          <p>LP: </p>
          <p>Wins: </p>
          <p>Losses: </p>
        </div> 
        : 
        <div className="summoner-info">
          <button onClick={updateSummoner} className="btn btn-outline-success my-2 my-sm-0">Update</button>
          <p>Summoner: {summoner.summonerName}</p>
          <p>Level: {summoner.summonerLevel}</p>
          <p>Rank: {summoner.tier} {summoner.rank}</p>
          <p>LP: {summoner.leaguePoints}</p>
          <p>Wins: {summoner.wins}</p>
          <p>Losses: {summoner.losses}</p>
        </div>
        }   
        <div className="live-game-container">
          <button onClick={getLiveGame} className="btn btn-outline-success my-2 my-sm-0">Live Game</button>
          
          {Object.keys(liveGame).length === 0 ? <div></div> : 
          <ul>
            <p>Blue Team</p>
            {liveGame.bluePlayers.map((item, index) => {
              return (
                <li>
                  <a href={`/summoners/${item.summonerName}`} target="_blank" rel="noopener noreferrer">{item.summonerName}</a> {item.championId}
                </li>
              )
            })}

            <br></br>
            
            <p>Red Team</p>
            {liveGame.redPlayers.map((item, index) => {
              return (
                <li>
                  <a href={`/summoners/${item.summonerName}`} target="_blank" rel="noopener noreferrer">{item.summonerName}</a> {item.championId}
                </li>
              )
            })}
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
      <h3>Created by Palagino and Zethyos</h3>
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