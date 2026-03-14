import React, { useState } from 'react'
import HomePage from './gui/components/Homepage'
import ProjectLayout from './gui/components/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/ProjectInformationPlaceholder'
import BridgeData from './gui/components/bridgedata/BridgeData'
import './App.css'

// Map sidebar node labels → content components
const CONTENT_MAP = {
  'General Information': <ProjectInformationPlaceholder />,
  'Bridge Data': <BridgeData />,
}

const ComingSoon = ({ label }) => (
  <div style={{ padding: '32px', color: '#888', fontSize: '0.9rem' }}>
    <span style={{ color: '#5b9bd5', fontWeight: 600 }}>{label}</span> — coming soon.
  </div>
)

function App() {
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [activeNode, setActiveNode] = useState('General Information')

  if (isProjectOpen) {
    const content = CONTENT_MAP[activeNode] ?? <ComingSoon label={activeNode} />
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
