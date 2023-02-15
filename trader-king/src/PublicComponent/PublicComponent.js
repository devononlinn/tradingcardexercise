import React, { useEffect, useState,  } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import css from "../App.sass";

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
            <section className="public-container">
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
                            <Card className="mt-4 mb-4 card-child" style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={item.image} alt="card" />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <b><span>Price:</span><span> ${item.price}</span></b>
                                </Card.Footer>
                            </Card> 
                            )
                        })
                    }
                </div>
            </section>
        ) : <p>No Inventory Available.</p>
    );
}