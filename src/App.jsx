import React, { useState, useEffect } from 'react'
import HomePage from './gui/components/Homepage'
import Loginpage from './gui/Login/Loginpage'
import ProjectLayout from './gui/components/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/global_info/ProjectInformationPlaceholder'
import BridgeData from './gui/components/bridgedata/BridgeData'
import FinancialData from './gui/components/financialdata/FinancialData'
import TrafficData from './gui/components/trafficdata/TrafficData'
import ConstructionWorkData from './gui/components/constructionworkdata/ConstructionWorkData'
import CarbonEmissionContainer from './gui/components/carbon_emission/CarbonEmissionContainer'
import Logs from './gui/components/Logs'
import MaintenanceAndRepair from './gui/components/maintenance_and_repair/MaintenanceAndRepair'
import Recycling from './gui/components/recycling/Recycling'
import Demolition from './gui/components/demolition/Demolition'
import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [projectData, setProjectData] = useState(null)
  const [activeNode, setActiveNode] = useState('General Information')
  const [checkpoints, setCheckpoints] = useState([])
  const [logs, setLogs] = useState([])
  const [isLocked, setIsLocked] = useState(false)
  const [navTrigger, setNavTrigger] = useState(Date.now())
  const [userName, setUserName] = useState('')

  const [userSettings, setUserSettings] = useState({
    appearanceMode: 'Auto',
    lightTheme: 'Pink',
    darkTheme: 'Pink'
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (userSettings.appearanceMode === 'Dark') {
        setIsDarkMode(true);
      } else if (userSettings.appearanceMode === 'Light') {
        setIsDarkMode(false);
      } else {
        // Auto
        setIsDarkMode(mediaQuery.matches);
      }
    };

    updateTheme(); // Call on appearanceMode change

    const handleChange = (e) => {
      if (userSettings.appearanceMode === 'Auto') {
        setIsDarkMode(e.matches);
      }
    };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleChange);
    else mediaQuery.addListener(handleChange);
    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', handleChange);
      else mediaQuery.removeListener(handleChange);
    };
  }, [userSettings.appearanceMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');

    if (isDarkMode) {
      if (userSettings.darkTheme === 'Pink') {
        root.style.setProperty('--app-bg-main', '#2a1a21');
        root.style.setProperty('--app-bg-card', '#1c1015');
        root.style.setProperty('--app-primary-accent', '#e84393');
      } else if (userSettings.darkTheme === 'Blue') {
        root.style.setProperty('--app-bg-main', '#0f172a');
        root.style.setProperty('--app-bg-card', '#0b1120');
        root.style.setProperty('--app-primary-accent', '#3b82f6');
      } else if (userSettings.darkTheme === 'Green') {
        root.style.setProperty('--app-bg-main', '#121e12');
        root.style.setProperty('--app-bg-card', '#0d160d');
        root.style.setProperty('--app-primary-accent', '#9acd32');
      }
    } else {
      if (userSettings.lightTheme === 'Pink') {
        root.style.setProperty('--app-bg-main', '#fff0f5');
        root.style.setProperty('--app-bg-card', '#ffe4e1');
        root.style.setProperty('--app-primary-accent', '#d63031');
      } else if (userSettings.lightTheme === 'Blue') {
        root.style.setProperty('--app-bg-main', '#f0f8ff');
        root.style.setProperty('--app-bg-card', '#e6f0fa');
        root.style.setProperty('--app-primary-accent', '#0984e3');
      } else if (userSettings.lightTheme === 'Green') {
        root.style.setProperty('--app-bg-main', '#f4fbf0');
        root.style.setProperty('--app-bg-card', '#e8f5e9');
        root.style.setProperty('--app-primary-accent', '#9acd32');
      }
    }
  }, [isDarkMode, userSettings]);

  const addLog = (message) => {
    const time = new Date().toTimeString().split(' ')[0]
    setLogs(prev => [...prev, `[${time}] ${message}`])
  }

  const handleLogin = (isGuest = false, name = "Admin") => {
    setIsLoggedIn(true)
    setUserName(name)
    addLog(isGuest ? `Guest user '${name}' logged in.` : `User '${name}' logged in.`)
  }

  const handleProjectOpen = () => {
    setProjectData({ name: 'Bridge_Assessment_01', country: 'India', currency: 'INR', unitSystem: 'Metric' })
    setIsProjectOpen(true)
    addLog("Project 'Bridge_Assessment_01' opened successfully.")
  }

  const handleNewProject = (data) => {
    // Reset project state for a new project
    setProjectData(data)
    setCheckpoints([])
    setLogs([])
    setIsLocked(false)
    setActiveNode('General Information')
    setIsProjectOpen(true)
    addLog(`New project '${data.name}' created.`)
  }

  const handleOpenProject = (data) => {
    // Load existing project data
    setProjectData(data)
    setCheckpoints([]) // In a real app, these would come from the loaded data
    setLogs([])
    setIsLocked(false)
    setActiveNode('General Information')
    setIsProjectOpen(true)
    addLog(`Project '${data.name}' opened successfully.`)
  }

  const handleSaveCheckpoint = (newCheckpoint) => {
    setCheckpoints(prev => [...prev, newCheckpoint])
    addLog(`Checkpoint '${newCheckpoint.label}' created.`)
  }

  const handleDeleteCheckpoint = (index) => {
    const cp = checkpoints[index]
    setCheckpoints(prev => prev.filter((_, i) => i !== index))
    addLog(`Checkpoint '${cp?.label || 'Unknown'}' deleted.`)
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  const handleSetActiveNode = (node) => {
    setNavTrigger(Date.now())
    if (node !== activeNode) {
      setActiveNode(node)
      addLog(`Switched to ${node} view.`)
    }
  }

  const CONTENT_MAP = {
    'General Information': <ProjectInformationPlaceholder />,
    'Bridge Data': <BridgeData />,
    'Financial Data': <FinancialData />,
    'Traffic Data': <TrafficData />,
    'Construction Work Data': <ConstructionWorkData setActiveNode={setActiveNode} />,
    'Foundation': <ConstructionWorkData setActiveNode={setActiveNode} />,
    'Sub Structure': <ConstructionWorkData initialTab="SubStructure" setActiveNode={setActiveNode} />,
    'Super Structure': <ConstructionWorkData initialTab="SuperStructure" setActiveNode={setActiveNode} />,
    'Miscellaneous': <ConstructionWorkData initialTab="Miscellaneous" setActiveNode={setActiveNode} />,
    'Carbon Emission Data': <CarbonEmissionContainer />,
    'Material Emissions': <CarbonEmissionContainer initialTab="Material" />,
    'Transportation Emissions': <CarbonEmissionContainer initialTab="Transportation" />,
    'Machinery Emissions': <CarbonEmissionContainer initialTab="Machinery" />,
    'Traffic Diversion Emissions': <CarbonEmissionContainer initialTab="Traffic" />,
    'Social Cost of Carbon': <CarbonEmissionContainer initialTab="SocialCost" />,
    'Maintenance and Repair': <MaintenanceAndRepair />,
    'Recycling': <Recycling />,
    'Demolition': <Demolition />,
    'Logs': <Logs />,
    'Outputs': <Outputs addLog={addLog} />,
  }

  if (!isLoggedIn) {
    const handleAdminLogin = (credentials) => {
      const namePart = credentials.email ? credentials.email.split('@')[0] : 'Admin';
      handleLogin(false, namePart);
    };
    return <Loginpage onLogin={handleAdminLogin} onGuestLogin={(name) => handleLogin(true, name || 'Guest')} />
  }

  if (isProjectOpen) {
    const content = CONTENT_MAP[activeNode] || null
    return (
      <ProjectLayout
        activeNode={activeNode}
        setActiveNode={handleSetActiveNode}
        onBackToHome={() => {
          setIsProjectOpen(false)
          addLog("Project closed. Returning to home.")
        }}
        checkpoints={checkpoints}
        onSaveCheckpoint={handleSaveCheckpoint}
        onDeleteCheckpoint={handleDeleteCheckpoint}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        addLog={addLog}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
      >
        {React.cloneElement(content, { 
          checkpoints, 
          logs, 
          onClearLogs: handleClearLogs,
          isLocked: isLocked,
          navTrigger: navTrigger
        })}
      </ProjectLayout>
    )
  }

  return (
    <HomePage
      onProjectOpen={handleProjectOpen}
      userName={userName}
      isDarkMode={isDarkMode}
      userSettings={userSettings}
      setUserSettings={setUserSettings}
    />
  )
}

export default App
