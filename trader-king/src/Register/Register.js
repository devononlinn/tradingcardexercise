import React, { useEffect, useState }  from 'react';
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Register() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();

        // set configurations
        const configuration = {
            method: "post",
            url: "http://localhost:5000/register",
            data: {
                firstname,
                lastname,
                email,
                password,
            },
        };

        axios(configuration)
            .then((result) => {
                setFirstname("");
                setLastname("");
                setEmail("");
                setPassword("");
                setRegister(true);
            })
            .catch((err) => {
                console.log(err);
                err = new Error();
            });
    }

    return (
        <div className="reg-form">
            <h2>Register</h2>
            <Form onSubmit={(e)=>handleSubmit(e)}>
                {/* firstname */}
                <Form.Group controlId="formBasicEmail">
                <Form.Label>First name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="firstname" 
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First Name" 
                />
                </Form.Group>

                {/* lastname */}
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Last name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="firstname" 
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last Name" 
                />
                </Form.Group>

                {/* email */}
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" 
                />
                </Form.Group>

                {/* password */}
                <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                />
                </Form.Group>

                {/* submit button */}
                <Button
                    className="reg-Btn"
                    variant="info"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                >
                    Register
                </Button>

                {/* display success message */}
                {register ? (
                <p className="text-success">Registered Successfully. Please login.</p>
                ) : (
                <p className="text-danger">You Are Not Registered</p>
                )}
            </Form>
        </div>
    )
}