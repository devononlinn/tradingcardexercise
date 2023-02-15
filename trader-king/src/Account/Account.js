import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Cookies from "universal-cookie";
import Carousel from 'react-bootstrap/Carousel';
import pokemonBanner from '../assets/pokemon-banner.jpg';
import baseballBanner from '../assets/baseball-banner.PNG';
import magicBanner from '../assets/magic-banner.PNG';
import sass from "../App.sass";

export default function Account() {

  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  if(!token) {
    return (
      <Container fluid className="account-container">
        <Row className="account-row">
          <Col xs={12} sm={12} md={12} lg={12} className="account-col account-col--carousel">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={pokemonBanner}
                  alt="Pokemon"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={baseballBanner}
                  alt="Baseball"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={magicBanner}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
            <div className="carousel-overlay">
              <h3>Check out our inventory!</h3>
              <Button
                  type="link"
                  variant="info"
                  style={{width:"8rem"}}
                  onClick={ (e) => {
                    window.location.href = "/public";
                  }}
                >View
                </Button>
              </div>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} className="account-col account-login" id="account-login">
            <Login />
            <div className="access-divider">OR</div>
            <Button
              variant="info"
              className="access-btn"
              onClick={(e) => {
                document.getElementById("account-login").style.display = "none";
                document.getElementById("account-registration").style.display = "block";
              }}
            >
              Register for Account
            </Button>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} className="account-col account-register" id="account-registration">
            <Register />
          </Col>
        </Row>
      </Container>
    );
  } else {
    window.location.href = "/member";
  }
  
}