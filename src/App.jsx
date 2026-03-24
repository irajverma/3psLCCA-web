import React, { useState } from 'react'
import HomePage from './gui/components/Homepage'
import Loginpage from './gui/Login/Loginpage'
import ProjectLayout from './gui/components/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/global_info/ProjectInformationPlaceholder'
import BridgeData from './gui/components/bridge_data/BridgeData'
import FinancialData from './gui/components/financial_data/FinancialData'
import TrafficData from './gui/components/traffic_data/TrafficData'
import ConstructionWorkData from './gui/components/structure/ConstructionWorkData'
import './App.css'

const CONTENT_MAP = {
  'General Information': <ProjectInformationPlaceholder />,
  'Bridge Data': <BridgeData />,
  'Financial Data': <FinancialData />,
  'Traffic Data': <TrafficData />,
  'Construction Work Data': <ConstructionWorkData />,
  'Foundation':    <ConstructionWorkData />,
  'Sub Structure': <ConstructionWorkData initialTab="SubStructure" />,
  'Super Structure': <ConstructionWorkData initialTab="SuperStructure" />,
  'Miscellaneous': <ConstructionWorkData initialTab="Miscellaneous" />,
}



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [activeNode, setActiveNode] = useState('General Information')

  if (!isLoggedIn) {
    return <Loginpage onLogin={() => setIsLoggedIn(true)} onGuestLogin={() => setIsLoggedIn(true)} />
  }

  if (isProjectOpen) {
    const content = CONTENT_MAP[activeNode] || null
    return (
      <ProjectLayout activeNode={activeNode} setActiveNode={setActiveNode}>
        {content}
      </ProjectLayout>
    )
  }

  return (
    <HomePage onProjectOpen={() => setIsProjectOpen(true)} />
  )
}

export default App
