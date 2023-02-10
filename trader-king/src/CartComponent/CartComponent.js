import React, { useEffect, useState }  from 'react';
import CounterInput from 'react-bootstrap-counter';
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Form, Table } from "react-bootstrap";
import Logout from '../Logout/Logout';
import css from "./CartComponent.css";

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
        <div>
                <Logout></Logout>
                {
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <td>&nbsp;</td>
                                <th>Description</th>
                                <th>Price/Each</th>
                                <th>Quantity</th>
                                <th>Total:</th>
                                <th>Remove</th>
                            </tr>
                        </thead>

                        {
                            purchases? (
                                <tbody>
                                    {
                                        purchases.map((item,index) => {
                                            return ( <tr key={index}>
                                                <td className="align-middle">{item.name}</td>
                                                <td className="align-middle"><img src={item.image} alt="item display"/></td>
                                                <td className="align-middle">{item.description}</td>
                                                <td className="align-middle">{item.price}</td>
                                                <td className="align-middle">
                                                <CounterInput 
                                                    value={item.quantity} 
                                                    min={0} 
                                                    max={20} 
                                                    onChange={(value) => {
                                                        updateQuantity(item, value);
                                                    }
                                                }  
                                                />
                                                </td>
                                                <td className="align-middle">
                                                    <b>{item.price * item.quantity}</b>
                                                </td>
                                                <td className="align-middle">
                                                    <Button
                                                        type="submit"
                                                        variant="outline-danger"
                                                        onClick={() => remove(item)}
                                                        >
                                                        <span><i className="fa fa-times" aria-hidden="true"></i></span>
                                                    </Button>
                                                </td>
                                            </tr> )
                                            
                                        })
                                        
                                    }
                                    <tr className="cart-total">
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td><b><u>Total Cost: ${total}</u></b></td>
                                        <td>&nbsp;</td>
                                    </tr>
                                </tbody>
                            ) : <tbody><tr><td>You have nothing in your cart</td></tr></tbody>
                        }
                    </Table>
                }
                <div className="buy-btn">
                    <Button
                        type="submit"
                        variant="outline-primary"
                        onClick={() => update() }
                        >
                        Buy
                    </Button>
                </div>                
        </div>
    );
}