import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Crunchbangle's Penbot Test Simulator</h1>
          <p>
            Three aims:
            <ul>
              <li>Test some shared library code.</li>
              <li>Test some character drawing paths and word alignments, virtually (because I'm still waiting on hardware irl)</li>
              <li>To treat it as a fun learning exercise andnot use any AI.</li>
            </ul>
          </p>
        </div>
      </section>

      <section id="botsim"> 
        <BotSimContainer />
      </section>
    </>
  )
}

export default App
