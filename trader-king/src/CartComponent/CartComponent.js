import React, { useEffect, useState }  from 'react';
import CounterInput from 'react-bootstrap-counter';
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Form, Table, Modal } from "react-bootstrap";
import Logout from '../Logout/Logout';
import "../App.sass";

export default function CartComponent() {

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [user, setUser] = useState("");
    const [purchases, setPurchases] = useState(null);
    const [cards, setCards] = useState(null);
    const [total, setTotal] = useState(0);

    const pageSetup = () => {
        const configuration = {
            method: "get",
            url: "http://localhost:5000/cart",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios(configuration)
        .then((result) => {
            setCards(result.data.cards);
            setUser(result.data.user);
            const cartItems = [];
            let total = 0;
            result.data.cart.forEach((item) => {
                result.data.cards.forEach((card) => {
                    if (item.product === card._id) {
                        total += (item.productQuantity * card.price);
                        cartItems.push({
                            user: item.user || card.user,
                            cartId: item._id,
                            product: item.product || card._id,
                            name: card.name,
                            price: card.price,
                            description: card.description,
                            image: card.image,
                            quantity: item.productQuantity,
                        });
                    }
                });
            });
            setTotal(total);
            setPurchases(cartItems);
        })
        .catch((error) => {
            error = new Error();
        });
    }

    const remove = (item) => {
        const configuration = {
            method: "delete",
            url: "http://localhost:5000/remove",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                item: item.cartId
            }
        };

        axios(configuration)
        .then(() => window.location.reload())
        .catch((error) => {
            error = new Error();
        });
    }
    
    const update = () => {
        alert("Just email your credit card information to me and Ill get this order put in for you. Dont forget your social security number and any other personal information that may help... speed things up.")
    }

    const updateQuantity = (item, value) => {
        const newPurchases = [...purchases];
        const index = newPurchases.findIndex((i) => i.cartId === item.cartId);
        newPurchases[index].quantity = value;
        setPurchases(newPurchases);
    
        const configuration = {
            method: "put",
            url: `http://localhost:5000/update/:${item.cartId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                cartId: item.cartId,
                quantity: item.quantity
            }
        };
    
        axios(configuration)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            error = new Error();
        });
    };

    useEffect(() => {
        pageSetup();
    }, [])

    return (
        <section className="cart-container">
            <div className="component-header">
                <h2>Checkout</h2>
                <Logout></Logout>
            </div>
                    {purchases ? (
                        <div className="cart">   
                            {purchases.map((item,index) => {
                                return ( 
                                    <div className="cart-item">
                                        <div className="item-data">
                                            <div className="item-image">
                                                <img src={item.image} alt="item display"/>
                                            </div>
                                            <div className="item-details">
                                                <div><b>{item.name}</b></div>
                                                <div style={{color: "#454444"}}>{item.description}</div>
                                                <div>{item.price}</div>
                                                <div className="details-quantity">
                                                    <CounterInput 
                                                        value={item.quantity}
                                                        className="item-counter"
                                                        min={1} 
                                                        max={20}
                                                        onChange={(value) => {
                                                            updateQuantity(item, value);
                                                        }
                                                    }  
                                                    />
                                                    <div className="item-total">
                                                        <b>Cost: </b>${item.price * item.quantity}<br />
                                                        <small>(<em> ${item.price} x {item.quantity}</em> )</small>
                                                    </div>
                                                </div>
                                                <div className="item-remove">
                                                    <Button
                                                        type="submit"
                                                        variant="outline-danger"
                                                        onClick={() => remove(item)}
                                                        >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                )})  
                            }
                        </div>
                        
                    ) : <p>You have nothing in your cart</p>}
                <div className="cart-cost">
                    <p>Total: ${total}</p>
                    <Button
                        type="submit"
                        variant="outline-primary"
                        onClick={() => update() }
                        >
                        Purchase
                    </Button>
                </div>            
        </section>
    );
}