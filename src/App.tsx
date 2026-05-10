import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { LLMPage } from './pages/LLMPage'
import { JEPAPage } from './pages/JEPAPage'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<LLMPage />} />
        <Route path="/jepa" element={<JEPAPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
