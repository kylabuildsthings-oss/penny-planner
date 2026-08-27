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

  const compactLayout = thinking || Boolean(results)

  return (
    <div className={`flex min-h-dvh flex-col ${compactLayout ? 'has-results' : ''}`}>
      <Header mood={mood} speech={speech} progress={progress} />
      <main className={`flex flex-1 flex-col ${compactLayout ? '' : 'landing-main'}`}>
        <InputForm
          inputs={inputs}
          onChange={updateInput}
          onCrack={crackTheNut}
          cracked={cracked}
          thinking={thinking}
          sparkleKey={sparkleKey}
          compact={compactLayout}
        />
        <ResultsCards results={thinking ? null : results} />
      </main>
      <Footer />
    </div>
  )
}
