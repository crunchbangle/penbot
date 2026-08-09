import './App.css'
import { BotSimContainer } from './components/BotSimContainer'

const App: React.FC = () => {
  return (
    <>
      <section id="center">
        <div>
          <h1>Crunchbangle's Penbot Test Simulator</h1>
          <p>
            Three aims:
          </p>
          <ul>
            <li>Test some shared library code.</li>
            <li>Test some character drawing paths and word alignments, virtually (because I'm still waiting on hardware irl)</li>
            <li>To treat it as a fun learning exercise andnot use any AI.</li>
          </ul>
        </div>
      </section>

      <section id="botsim"> 
        <BotSimContainer />
      </section>
    </>
  )
}

export default App
