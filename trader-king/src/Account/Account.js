import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Cookies from "universal-cookie";
import Carousel from 'react-bootstrap/Carousel';
import pokemonBanner from '../assets/pokemon-banner.jpg';
import baseballBanner from '../assets/baseball-banner.PNG';
import magicBanner from '../assets/magic-banner.PNG';

export default function Account() {

  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  if(!token) {
    return (
      <Container className="account-container">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={pokemonBanner}
              alt="Pokemon"
            />
            <Carousel.Caption>
              <h3>Pokemon Cards</h3>
              <p>Are they worth something? Who knows!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={baseballBanner}
              alt="Baseball"
            />

            <Carousel.Caption>
              <h3>Baseball Card</h3>
              <p>Baseball cards at arbitrary values!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={magicBanner}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Magic The Gathering</h3>
              <p>
                Magic cards galore!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Row className="public-access">
          <p>Not sure you want to sign up? Check out inventory!</p>
          <Button
            type="link"
            variant="info"
            style={{width:"8rem"}}
            onClick={ (e) => {
              window.location.href = "/public";
              
            }}
          >View Inventory</Button>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Register />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Login />
          </Col>
        </Row>
      </Container>
    );
  } else {
    window.location.href = "/member";
  }
  
}