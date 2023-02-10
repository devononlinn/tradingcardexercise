import React, { useEffect, useState,  } from "react";
import ReactDOM from 'react-dom';
import CounterInput from 'react-bootstrap-counter';
import { Button, Card, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import AddCardModalComponent from "../AddCardModalComponent/AddCardModalComponent";
import Logout from "../Logout/Logout";
import "./MemberComponent.css";


export default function MemberComponent() {

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [data, setData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [user, setUser] = useState("");
    const [allCards, setAllCards] = useState(null);
    const [myCards, setMyCards] = useState(null);
    const [displayCards, setDisplayCards] = useState(null);
    const [key, setKey] = useState('allcards');

    const handleDataChange = (newData) => {
        if (Object.keys(newData).length !== 0) {
            setData(newData);
        }
    };

    const handleSubmit = (configuration) => {
        const config = configuration;
        axios(config).then((result) => {
            setSubmit(true);
            window.location.reload();
        })
        .catch((error) => {
            error = new Error();
        });
    }

    const addToCart = (card) => {
        const configuration = {
            method: "POST",
            url: `http://localhost:5000/add-to-cart/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                userId: user.userId,
                product: card._id,
                productQuantity: card.quantity,
            }
        }

        axios(configuration)
        .then(() => {
            console.log("Card added to cart");
            //TODO
                // Add some sort of response for this success
        })
        .catch((err) => {
            console.error(err);
            err = new Error();
        });
    }

    const pageSetup = () => {
        const configuration = {
            method: "get",
            url: "http://localhost:5000/member",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios(configuration)
        .then((result) => {
            setDisplayCards(result.data.cards);
            setAllCards(result.data.cards);
            const loggedInUser = result.data.user;
            const myCards = result.data.cards.filter(card => card.user === loggedInUser.userId);
            setMyCards(myCards);
            setUser(result.data.user);
          })
        .catch((error) => {
            error = new Error();
        });
    }

    useEffect(() => {    
        pageSetup();

        if (Object.keys(data).length !== 0) {
            const configuration = {
                method: "post",
                url: "http://localhost:5000/card-submit",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    userId: user.userId,
                    cardName: data.cardName,
                    cardDescription: data.cardDescription,
                    price: data.price,
                    image: data.image
                },
            };
            handleSubmit(configuration);
        }
        filterCards();
    }, [data, key]);

    const filterCards = (selectedKey) => {
        if (selectedKey === 'allcards') {
            setDisplayCards(allCards);
        } else {
            setDisplayCards(myCards);
        }
    }
    

    if (!displayCards) return <p className="loading">Loading...</p>;

    return (
        <div>
            <div className="member-actions">
                <h2 className="pt-4 pb-4">Welcome back, { user.firstname ? user.firstname : user.userEmail }!</h2>
                <Logout></Logout>
                
                <Tabs
                    defaultActiveKey="allcards"
                    id="card-tabs"
                    className="mb-3"
                    onSelect={(k) => filterCards(k)}
                    >
                    <Tab eventKey="allcards" title="All Cards"></Tab>
                    <Tab eventKey="mycards" title="My Cards"></Tab>
                    <div className="card-container">
                    { 
                        displayCards? (
                            displayCards.map((item,index) => {
                                return (
                                    <Card className="mt-4 mb-4 card--child" style={{ width: '14rem'}} key={index}>
                                        <Card.Img variant="top" src={item.image} alt="card" />
                                        <Card.Body>
                                            <Card.Title>{item.name}</Card.Title>
                                            <Card.Text>
                                                {item.description}
                                            </Card.Text>
                                            <div className="card-pricing">
                                                <Card.Text>
                                                    <b>${item.price}</b>
                                                </Card.Text>
                                                <span>
                                                    <CounterInput 
                                                        value={0} 
                                                        min={0} 
                                                        max={20} 
                                                        onChange={ (value) => { 
                                                                item["quantity"] = value;
                                                            } 
                                                        } 
                                                    />
                                                </span>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="card-actions">
                                            <Button 
                                                type="submit" 
                                                variant="danger" 
                                                onClick={() => { 
                                                    addToCart(item);
                                                    window.location.href = "/cart";
                                                }
                                            }
                                            >Add to cart
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                )
                            })
                        ): null
                    } 
                </div>
                </Tabs>

                <Button
                    variant="primary"
                    className="button-icon"
                    onClick={() => {
                        //Open the modal and pass the data as a prop
                        console.log(isOpen);
                        setIsOpen(true);
                    }}
                ><span><i className="fa fa-plus" aria-hidden="true"></i></span>New
                </Button>

                <AddCardModalComponent
                    isOpen={isOpen}
                    data={data}
                    onDataChange={handleDataChange}
                    onClose={() => {
                        setIsOpen(false);
                    }}
                />
            </div>
            <div className="card-container">
                { 
                    displayCards? (
                        displayCards.map((item,index) => {
                            return (
                                <Card className="mt-4 mb-4 card--child" style={{ width: '14rem'}} key={index}>
                                    <Card.Img variant="top" src={item.image} alt="card" />
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            {item.description}
                                        </Card.Text>
                                        <div className="card-pricing">
                                            <Card.Text>
                                                <b>${item.price}</b>
                                            </Card.Text>
                                            <span>
                                                <CounterInput 
                                                    value={0} 
                                                    min={0} 
                                                    max={20} 
                                                    onChange={ (value) => { 
                                                            item["quantity"] = value;
                                                        } 
                                                    } 
                                                />
                                            </span>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="card-actions">
                                        <Button 
                                            type="submit" 
                                            variant="danger" 
                                            onClick={() => { 
                                                addToCart(item);
                                                window.location.href = "/cart";
                                            }
                                        }
                                        >Add to cart
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            )
                        })
                    ): null
                } 
            </div>
            
        </div>
    );
}