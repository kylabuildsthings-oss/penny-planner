import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import InputForm from './components/InputForm.jsx'
import ResultsCards from './components/ResultsCards.jsx'
import { useDebtCalculator } from './hooks/useDebtCalculator.js'

export default function App() {
  const {
    inputs,
    updateInput,
    crackTheNut,
    mood,
    speech,
    cracked,
    thinking,
    results,
    progress,
    sparkleKey,
  } = useDebtCalculator()

  return (
    <div className="flex min-h-dvh flex-col">
      <Header mood={mood} speech={speech} progress={progress} />
      <main className="flex-1">
        <InputForm
          inputs={inputs}
          onChange={updateInput}
          onCrack={crackTheNut}
          cracked={cracked}
          thinking={thinking}
          sparkleKey={sparkleKey}
        />
        <ResultsCards results={thinking ? null : results} />
      </main>
      <Footer />
    </div>
  )
}
