import React, { useEffect, useState,  } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import css from "./PublicComponent.css";

export default function PublicComponent() {

    const [cards, setCards] = useState(null);

    const getAllCards = () => {
        // set configurations for the API call here
        const configuration = {
            method: "get",
            url: "http://localhost:5000/public",
        };

        // make the API call
        axios(configuration)
        .then((result) => {
            setCards(result.data.cards);
            console.log(result.data.cards);
        })
        .catch((error) => {
            error = new Error();
        });
    }

    useEffect(() => {
        getAllCards();
    }, []);

    if (!cards) return <p class="loading">Loading...</p>;

    return (
        cards? (
            <div className="public-container">
                <Button
                    className="public-Btn"
                    type="link"
                    variant="outline-primary"
                    onClick={ () => {
                        window.location.href = "/";
                      }}
                >
                    Register
                </Button>
                <div className="card-container">
                    {
                        cards.map((item,index) => {
                            return (
                            <Card className="mt-4 mb-4 card--child" style={{ width: '14rem' }}>
                                <Card.Img variant="top" src={item.image} alt="card" />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <b>Cost: ${item.price}</b>
                                    </Card.Text>
                                </Card.Body>
                            </Card> 
                            )
                        })
                    }
                </div>
            </div>
        ) : <p>No Inventory Available.</p>
    );
}