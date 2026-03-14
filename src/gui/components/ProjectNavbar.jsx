import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import './ProjectNavbar.css';

const ProjectNavbar = () => {
    return (
        <Navbar variant="dark" className="project-navbar px-3" expand="lg">
            <Nav className="me-auto align-items-center">
                <Nav.Link href="#home" className="navbar-item">Home</Nav.Link>
                
                <NavDropdown title="File" id="file-nav-dropdown" className="navbar-item">
                    <NavDropdown.Item href="#new">New</NavDropdown.Item>
                    <NavDropdown.Item href="#open">Open</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#save">Save</NavDropdown.Item>
                    <NavDropdown.Item href="#save-as">Save As...</NavDropdown.Item>
                    <NavDropdown.Item href="#copy">Create a Copy</NavDropdown.Item>
                    <NavDropdown.Item href="#print">Print</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#rename">Rename</NavDropdown.Item>
                    <NavDropdown.Item href="#export">Export</NavDropdown.Item>
                    <NavDropdown.Item href="#history">Version History</NavDropdown.Item>
                    <NavDropdown.Item href="#info">Info</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Help" id="help-nav-dropdown" className="navbar-item">
                    <NavDropdown.Item href="#contact">Contact us</NavDropdown.Item>
                    <NavDropdown.Item href="#feedback">Feedback</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#tutorials">Video Tutorials</NavDropdown.Item>
                    <NavDropdown.Item href="#community">Join our Community</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link href="#tutorials" className="navbar-item">Tutorials</Nav.Link>
                <Nav.Link href="#logs" className="navbar-item">Logs</Nav.Link>
            </Nav>

            <Nav className="ms-auto align-items-center column-gap-3">
                <span className="status-text me-2">All changes saved</span>
                <Button variant="outline-secondary" size="sm" className="navbar-btn">Save Checkpoint</Button>
                <Button variant="outline-secondary" size="sm" className="navbar-btn">Checkpoints</Button>
                <Button variant="primary" size="sm" className="navbar-btn calculate-btn">Calculate</Button>
                <Button variant="outline-secondary" size="sm" className="navbar-btn">Lock</Button>
            </Nav>
        </Navbar>
    );
};

export default ProjectNavbar;
