import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

const NavItemLink = ({ href, children }) => {
    const [hover, setHover] = useState(false);
    return (
        <Nav.Link 
            href={href} 
            className="px-2 py-1 mx-1 rounded"
            style={{ 
                color: hover ? 'var(--app-primary-accent)' : 'var(--app-text-primary)', 
                backgroundColor: hover ? 'var(--app-bg-alt)' : 'transparent',
                fontSize: '14px',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </Nav.Link>
    );
};

const CustomDropdown = ({ title, id, items }) => {
    const [hover, setHover] = useState(false);
    return (
        <NavDropdown 
            title={title} 
            id={id} 
            className="px-1"
            style={{
                color: hover ? 'var(--app-primary-accent)' : 'var(--app-text-primary)', 
                backgroundColor: hover ? 'var(--app-bg-alt)' : 'transparent',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {items.map((item, idx) => (
                item === "divider" 
                ? <NavDropdown.Divider key={idx} style={{ borderColor: 'var(--app-border-light)' }} />
                : <NavDropdown.Item 
                    key={idx} 
                    href={item.href} 
                    className="custom-dropdown-item"
                    style={{ fontSize: '14px', color: 'var(--app-text-primary)' }}
                  >
                      {item.label}
                  </NavDropdown.Item>
            ))}
        </NavDropdown>
    );
};

const CustomNavBtn = ({ variant, outlineColor, outlineHoverBg, children, ...props }) => {
    const [hover, setHover] = useState(false);
    const borderCol = hover ? 'var(--app-primary-accent)' : outlineColor;
    const bgCol = hover ? outlineHoverBg : 'transparent';
    const textCol = hover ? 'var(--app-text-primary)' : 'var(--app-text-secondary)';

    return (
        <Button 
            variant={variant} 
            size="sm" 
            style={{ 
                borderColor: variant === 'outline-secondary' ? borderCol : 'transparent',
                backgroundColor: variant === 'outline-secondary' ? bgCol : 'transparent',
                color: variant === 'outline-secondary' ? textCol : 'var(--app-text-secondary)',
                fontSize: '13px',
                padding: '4px 12px',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            {...props}
        >
            {children}
        </Button>
    );
};

const ProjectNavbar = () => {
    return (
        <Navbar expand="lg" className="px-3 border-bottom custom-project-nav" style={{ 
            backgroundColor: 'var(--app-bg-card)', 
            borderBottomColor: 'var(--app-border-light)',
            minHeight: '48px',
            fontFamily: '"Segoe UI", system-ui, sans-serif'
        }}>
            <style>{`
                .custom-project-nav .nav-link { color: var(--app-text-primary) !important; font-size: 14px; }
                .custom-dropdown-item:hover, .custom-dropdown-item:focus { background-color: var(--app-bg-main) !important; color: var(--app-primary-accent) !important; }
                .custom-project-nav .dropdown-menu { background-color: var(--app-bg-card); border: 1px solid var(--app-border-mid); }
                .custom-project-nav .dropdown-toggle { color: var(--app-text-primary) !important; font-size: 14px; }
            `}</style>
            
            <Nav className="me-auto align-items-center">
                <NavItemLink href="#home">Home</NavItemLink>
                
                <CustomDropdown 
                    title="File" 
                    id="file-nav-dropdown" 
                    items={[
                        { label: 'New', href: '#new' },
                        { label: 'Open', href: '#open' },
                        'divider',
                        { label: 'Save', href: '#save' },
                        { label: 'Save As...', href: '#save-as' },
                        { label: 'Create a Copy', href: '#copy' },
                        { label: 'Print', href: '#print' },
                        'divider',
                        { label: 'Rename', href: '#rename' },
                        { label: 'Export', href: '#export' },
                        { label: 'Version History', href: '#history' },
                        { label: 'Info', href: '#info' }
                    ]}
                />

                <CustomDropdown 
                    title="Help" 
                    id="help-nav-dropdown" 
                    items={[
                        { label: 'Contact us', href: '#contact' },
                        { label: 'Feedback', href: '#feedback' },
                        'divider',
                        { label: 'Video Tutorials', href: '#tutorials' },
                        { label: 'Join our Community', href: '#community' }
                    ]}
                />

                <NavItemLink href="#tutorials">Tutorials</NavItemLink>
                <NavItemLink href="#logs">Logs</NavItemLink>
            </Nav>

            <Nav className="ms-auto align-items-center column-gap-3">
                <span className="me-2" style={{ color: 'var(--app-text-muted)', fontSize: '13px' }}>All changes saved</span>
                <CustomNavBtn variant="outline-secondary" outlineColor="var(--app-border-dark)" outlineHoverBg="var(--app-bg-alt)">Save Checkpoint</CustomNavBtn>
                <CustomNavBtn variant="outline-secondary" outlineColor="var(--app-border-dark)" outlineHoverBg="var(--app-bg-alt)">Checkpoints</CustomNavBtn>
                
                <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="calc-btn mx-1"
                    style={{ fontSize: '13px', padding: '4px 12px', transition: 'all 0.2s', borderColor: 'var(--app-border-dark)', color: 'var(--app-text-secondary)', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--app-primary-accent)'; e.currentTarget.style.borderColor = 'var(--app-primary-accent)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--app-border-dark)'; e.currentTarget.style.color = 'var(--app-text-secondary)'; }}
                >
                    Calculate
                </Button>
                
                <CustomNavBtn variant="outline-secondary" outlineColor="var(--app-border-dark)" outlineHoverBg="var(--app-bg-alt)">Lock</CustomNavBtn>
            </Nav>
        </Navbar>
    );
};

export default ProjectNavbar;
