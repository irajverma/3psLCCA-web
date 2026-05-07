import React, { useState, useEffect } from 'react';
import { BsHouseDoorFill, BsFileEarmarkPlus, BsFolder2Open, BsGearFill, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineRedo } from 'react-icons/ai';
import NewProject from './NewProject';
import SettingsModal from './SettingsModal';

// Base Imports
import Logo3psLCCA from '../../assets/logo-3psLCCA.svg';

// Custom Logos (Light Theme)
import ConstructSteelLight from '../../assets/special/ConstructSteel_light.svg';
import IITBLogoLight from '../../assets/special/IITB_logo_light.svg';
import InsdagLight from '../../assets/special/INSDAG_light.svg';
import MOSLight from '../../assets/special/MOS_light.svg';

// Custom Logos (Dark Theme)
import ConstructSteelDark from '../../assets/special/ConstructSteel_dark.svg';
import IITBLogoDark from '../../assets/special/IITB_logo_dark.svg';
import InsdagDark from '../../assets/special/INSDAG_dark.svg';
import MOSDark from '../../assets/special/MOS_dark.svg';


const AppLogo = () => (
    <img src={Logo3psLCCA} alt="3psLCCA Logo" width="45" height="45" style={{ objectFit: 'contain' }} />
);


const Homepage = ({ onProjectOpen, userName = 'ritik!', isDarkMode, userSettings, setUserSettings }) => {
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('recentProjects');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('recentProjects', JSON.stringify(projects));
    }, [projects]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleNewProject = () => {
        setActiveTab('new');
        handleOpenModal();
    };

    const handleProjectCreate = (newProjectData) => {
        const newProject = {
            id: Date.now(),
            name: newProjectData.name,
            date: 'just now'
        };
        setProjects(prev => [...prev, newProject]);
        setActiveTab('home');
    };

    const getGreetingTime = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    };

    let theme = isDarkMode ? {
        bgMain: '#1e2023',
        bgSidebar: '#15171a',
        bgCard: '#24272b',
        textPrimary: '#e3e5e8',
        textSecondary: '#949ba4',
        border: '#2f3136',
        inputBg: '#2b2d31',
        activeIconBg: '#2c3b1d',
        activeIconColor: '#8bc34a',
        logoIITB: IITBLogoDark,
        logoConstructSteel: ConstructSteelDark,
        logoMOS: MOSDark,
        logoINSDAG: InsdagDark,
        filterBtnUnselectedBg: '#2b2d31'
    } : {
        bgMain: '#f2f4f7',
        bgSidebar: '#fbfcfd',
        bgCard: '#ffffff',
        textPrimary: '#495057',
        textSecondary: '#8a91a5',
        border: '#e2e5e9',
        inputBg: '#ffffff',
        activeIconBg: '#eef3e1',
        activeIconColor: '#8bc34a',
        logoIITB: IITBLogoLight,
        logoConstructSteel: ConstructSteelLight,
        logoMOS: MOSLight,
        logoINSDAG: InsdagLight,
        filterBtnUnselectedBg: '#f8f9fa'
    };

    if (isDarkMode) {
        if (userSettings?.darkTheme === 'Pink') {
            theme.bgMain = '#2a1a21';
            theme.bgSidebar = '#1c1015';
            theme.activeIconColor = '#e84393';
            theme.activeIconBg = '#3a1e28';
        } else if (userSettings?.darkTheme === 'Blue') {
            theme.bgMain = '#0f172a';
            theme.bgSidebar = '#0b1120';
            theme.activeIconColor = '#3b82f6';
            theme.activeIconBg = '#172554';
        } else if (userSettings?.darkTheme === 'Green') {
            theme.bgMain = '#121e12';
            theme.bgSidebar = '#0d160d';
            theme.activeIconColor = '#9acd32';
            theme.activeIconBg = '#1a2e1a';
        }
    } else {
        if (userSettings?.lightTheme === 'Pink') {
            theme.bgMain = '#fff0f5';
            theme.bgSidebar = '#ffe4e1';
            theme.activeIconColor = '#d63031';
            theme.activeIconBg = '#ffdada';
        } else if (userSettings?.lightTheme === 'Blue') {
            theme.bgMain = '#f0f8ff';
            theme.bgSidebar = '#e6f0fa';
            theme.activeIconColor = '#0984e3';
            theme.activeIconBg = '#d0e8ff';
        } else if (userSettings?.lightTheme === 'Green') {
            theme.bgMain = '#f4fbf0';
            theme.bgSidebar = '#e8f5e9';
            theme.activeIconColor = '#9acd32';
            theme.activeIconBg = '#d4edda';
        }
    }

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: theme.bgMain, color: theme.textPrimary, fontFamily: 'Inter, sans-serif', transition: 'background-color 0.3s ease' }}>

            {/* Left Sidebar */}
            <div className="d-flex flex-column align-items-center" style={{ width: '85px', backgroundColor: theme.bgSidebar, borderRight: `1px solid ${theme.border}`, zIndex: 10, transition: 'background-color 0.3s ease' }}>
                {/* Home Icon */}
                <div
                    className="d-flex flex-column align-items-center justify-content-center w-100 py-3"
                    style={{ cursor: 'pointer', backgroundColor: activeTab === 'home' ? theme.activeIconBg : 'transparent', color: activeTab === 'home' ? theme.activeIconColor : theme.textSecondary, transition: 'all 0.2s' }}
                    onClick={() => setActiveTab('home')}
                >
                    <BsHouseDoorFill size={22} className="mb-1" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? '600' : 'normal' }}>Home</span>
                </div>

                {/* New Project Icon */}
                <div
                    className="d-flex flex-column align-items-center justify-content-center w-100 py-3"
                    style={{ cursor: 'pointer', backgroundColor: activeTab === 'new' ? theme.activeIconBg : 'transparent', color: activeTab === 'new' ? theme.activeIconColor : theme.textSecondary, transition: 'all 0.2s' }}
                    onClick={handleNewProject}
                >
                    <BsFileEarmarkPlus size={22} className="mb-1" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'new' ? '600' : 'normal' }}>New</span>
                </div>

                {/* Open Project Icon */}
                <div
                    className="d-flex flex-column align-items-center justify-content-center w-100 py-3"
                    style={{ cursor: 'pointer', backgroundColor: activeTab === 'open' ? theme.activeIconBg : 'transparent', color: activeTab === 'open' ? theme.activeIconColor : theme.textSecondary, transition: 'all 0.2s' }}
                    onClick={() => {
                        setActiveTab('open');
                        onProjectOpen();
                    }}
                >
                    <BsFolder2Open size={22} className="mb-1" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'open' ? '600' : 'normal' }}>Open</span>
                </div>

                <div className="mt-auto w-100 d-flex flex-column align-items-center pb-2">
                    {/* Settings Icon (Bottom) */}
                    <div
                        className="d-flex flex-column align-items-center justify-content-center w-100 py-4"
                        style={{ cursor: 'pointer', backgroundColor: activeTab === 'settings' ? theme.activeIconBg : 'transparent', color: activeTab === 'settings' ? theme.activeIconColor : theme.textSecondary, transition: 'all 0.2s', borderTop: `1px solid ${theme.border}` }}
                        onClick={() => { setActiveTab('settings'); setShowSettingsModal(true); }}
                    >
                        <BsGearFill size={20} className="mb-1" />
                        <span style={{ fontSize: '11px' }}>Settings</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>

                {/* Header */}
                <header className="d-flex justify-content-between align-items-center px-5 py-3" style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bgMain, transition: 'background-color 0.3s ease' }}>
                    <h4 className="m-0" style={{ color: theme.textSecondary, fontWeight: '400', fontSize: '1.4rem' }}>
                        Good {getGreetingTime()}, <span style={{ color: theme.activeIconColor, fontWeight: '700' }}>{userName}</span>
                    </h4>
                    <AppLogo />
                </header>

                {/* Content */}
                <main className="flex-grow-1 px-5 py-4 d-flex flex-column" style={{ overflowY: 'auto' }}>

                    {/* Projects Header & Filters */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <div className="d-flex align-items-center gap-3">
                            <h6 className="m-0 fw-bold text-uppercase" style={{ fontSize: '0.85rem', color: theme.textSecondary, letterSpacing: '1px' }}>
                                RECENT PROJECTS
                            </h6>
                            <button className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textSecondary }}>
                                <AiOutlineRedo size={14} />
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-2" style={{ marginTop: '-4px' }}>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="form-control form-control-sm me-2 shadow-sm"
                                style={{
                                    backgroundColor: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary,
                                    width: '280px',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.8rem'
                                }}
                            />
                            <button className="btn btn-sm px-4 shadow-sm" style={{ backgroundColor: theme.inputBg, color: theme.activeIconColor, border: `1px solid ${theme.activeIconColor}`, borderRadius: '6px', fontWeight: '600', padding: '0.4rem' }}>Recent</button>
                            <button className="btn btn-sm px-4 shadow-sm" style={{ backgroundColor: theme.filterBtnUnselectedBg, color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: '6px', padding: '0.4rem' }}>Name</button>
                            <button className="btn btn-sm px-4 shadow-sm" style={{ backgroundColor: theme.filterBtnUnselectedBg, color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: '6px', padding: '0.4rem' }}>Pinned</button>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="row g-3">
                        {projects.map((proj) => (
                            <div key={proj.id} className="col-12 col-md-6 col-lg-6">
                                <div className="p-3 d-flex justify-content-between align-items-start shadow-sm" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '90px' }} onClick={() => onProjectOpen(proj.id, proj.name)}>
                                    <div className="d-flex flex-column justify-content-between h-100">
                                        <h6 className="mb-2" style={{ color: theme.textPrimary, fontSize: '0.95rem', fontWeight: '500' }}>{proj.name}</h6>
                                        <small style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>{proj.date}</small>
                                    </div>
                                    <button className="btn btn-link text-muted p-0 border-0" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                        <BsThreeDotsVertical size={16} color={theme.textSecondary} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>

                {/* Footer */}
                <footer className="px-5 py-2" style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bgMain, transition: 'background-color 0.3s ease' }}>
                    <div className="d-flex justify-content-between align-items-start mt-1">
                        <div className="d-flex flex-column align-items-start ps-2">
                            <span className="mb-2" style={{ fontSize: '0.65rem', color: theme.textSecondary, fontWeight: 'bold', letterSpacing: '1px' }}>DEVELOPED AT</span>
                            <img src={theme.logoIITB} alt="IIT Bombay Logo" height="50" style={{ opacity: isDarkMode ? 0.9 : 1 }} />
                        </div>
                        <div className="d-flex flex-column align-items-end pe-2">
                            <span className="mb-2" style={{ fontSize: '0.65rem', color: theme.textSecondary, fontWeight: 'bold', letterSpacing: '1px' }}>SUPPORTED BY</span>
                            <div className="d-flex align-items-center gap-4 mt-1">
                                <img src={theme.logoConstructSteel} alt="constructsteel Logo" height="22" />
                                <img src={theme.logoMOS} alt="Ministry of Steel Logo" height="30" />
                                <img src={theme.logoINSDAG} alt="INSDAG Logo" height="30" />
                            </div>
                            <div className="mt-2">
                                <span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>3psLCCA v2026.04.1</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* New Project Modal */}
            <NewProject show={showModal} handleClose={handleCloseModal} onProjectOpen={onProjectOpen} onProjectCreate={handleProjectCreate} isDarkMode={isDarkMode} theme={theme} />

            {/* Settings Modal */}
            <SettingsModal 
                show={showSettingsModal} 
                handleClose={() => setShowSettingsModal(false)} 
                isDarkMode={isDarkMode} 
                theme={theme} 
                initialUserName={userName}
                userSettings={userSettings}
                onSaveSettings={(settings) => {
                    setUserSettings({
                        appearanceMode: settings.appearanceMode,
                        lightTheme: settings.lightTheme,
                        darkTheme: settings.darkTheme
                    });
                }}
            />
        </div>
    );
};

export default Homepage;