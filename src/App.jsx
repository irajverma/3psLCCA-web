import React, { useState } from 'react'
import HomePage from './gui/Homepage'
import Loginpage from './gui/Login/Loginpage'
import ProjectLayout from './gui/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/global_info/ProjectInformationPlaceholder'
import BridgeData from './gui/components/bridge_data/BridgeData'
import CarbonEmissionContainer from './gui/components/carbon_emission/CarbonEmissionContainer'
import Logs from './gui/Logs'
import './App.css'

const CONTENT_MAP = (activeNode) => ({
  'General Information': <ProjectInformationPlaceholder />,
  'Bridge Data': <BridgeData />,
  'Carbon Emission Data': <CarbonEmissionContainer key="carbon-main" initialTab="Material Emissions" />,
  'Material Emissions': <CarbonEmissionContainer key="material" initialTab="Material Emissions" />,
  'Transportation Emissions': <CarbonEmissionContainer key="transport" initialTab="Transportation Emissions" />,
  'Machinery Emissions': <CarbonEmissionContainer key="machinery" initialTab="Machinery Emissions" />,
  'Traffic Diversion Emissions': <CarbonEmissionContainer key="traffic" initialTab="Traffic Diversion Emissions" />,
  'Social Cost of Carbon': <CarbonEmissionContainer key="social" initialTab="Social Cost of Carbon" />,
  'Logs': <Logs />,
})[activeNode] || null;



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [activeNode, setActiveNode] = useState('General Information')

  const handleLogout = () => {
    setIsProjectOpen(false)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Loginpage onLogin={() => setIsLoggedIn(true)} onGuestLogin={() => setIsLoggedIn(true)} />
  }

  if (isProjectOpen) {
    const content = CONTENT_MAP(activeNode)
    return (
      <ProjectLayout activeNode={activeNode} setActiveNode={setActiveNode} onLogout={handleLogout}>
        {content}
      </ProjectLayout>
    )
  }

  return (
    <HomePage onProjectOpen={() => setIsProjectOpen(true)} />
  )
}

export default App
