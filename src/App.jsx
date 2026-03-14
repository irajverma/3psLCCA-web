import React, { useState } from 'react'
import HomePage from './gui/components/Homepage'
import ProjectLayout from './gui/components/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/ProjectInformationPlaceholder'
import './App.css'

function App() {
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  if (isProjectOpen) {
    return (
      <ProjectLayout>
        <ProjectInformationPlaceholder />
      </ProjectLayout>
    )
  }

  return (
    <HomePage onProjectOpen={() => setIsProjectOpen(true)} />
  )
}

export default App

