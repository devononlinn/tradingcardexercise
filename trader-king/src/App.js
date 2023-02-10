import { Switch, Route } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account/Account";
import PublicComponent from "./PublicComponent/PublicComponent";
import MemberComponent from "./MemberComponent/MemberComponent";
import CartComponent from "./CartComponent/CartComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./App.css";

function App() {
  
  return (
    <Container>
      <Row>
        <Col>
          <Navbar bg="dark" expand="lg">
            <Container>
              <Navbar.Brand  style={{color:"#ffffff"}} href="/member">Trader King</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link className="nav-link nav-link--profile" style={{color:"#ffffff"}} href="/member"><i className="fa fa-user" aria-hidden="true"></i>My Profile</Nav.Link>
                  <Nav.Link className="nav-link nav-link--cart" style={{color:"#ffffff"}} href="/cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i>My Cart</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
      </Row>

      {/*App Routes*/}
      <Switch>
        <Route exact path="/" component={Account} />
        <Route exact path="/public" component={PublicComponent} />
        <ProtectedRoutes path="/member" component={MemberComponent} />
        <ProtectedRoutes path="/cart" component={CartComponent} />
      </Switch>
    </Container>
  );
}

export default App;