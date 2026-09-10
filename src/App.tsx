import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Commissions } from './pages/Commissions'
import { HowItWorks } from './pages/HowItWorks'
import { Terms } from './pages/Terms'
import { Track } from './pages/Track'
import { CursorGlow } from './components/CursorGlow'
import { Sidebar } from './components/Sidebar'
import { ScrollToTop } from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CursorGlow />
      <Sidebar />
      <div className="page-shift">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/track" element={<Track />} />
        </Routes>
      </div>
    </>
  )
}
