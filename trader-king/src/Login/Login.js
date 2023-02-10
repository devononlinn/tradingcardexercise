import React, { useEffect, useState }  from 'react';
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const cookies = new Cookies();

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        //alert("Submited");
        const configuration = {
            method: "post",
            url: "http://localhost:5000/login",
            data: {
                email,
                password,
            },
        };

        axios(configuration).then((result) => {
            // set login cookie
            cookies.set("TOKEN", result.data.token, {
                path: "/",
            });
            // redirect user to the member page
            window.location.href = "/member";
            setLogin(true);
        })
        .catch((error) => {
            error = new Error();
        });
    }

    return (
        <div className="reg-form">
            <h2>Login</h2>
            <Form onSubmit={(e)=>handleSubmit(e)}>
                {/* email */}
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                </Form.Group>

                {/* password */}
                <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} 
                />
                </Form.Group>

                {/* submit button */}
                <Button
                    className="reg-Btn"
                    variant="info" 
                    type="submit"
                    onClick={(e)=>handleSubmit(e)}
                >
                Login
                </Button>
            </Form>
        </div>
    )
}