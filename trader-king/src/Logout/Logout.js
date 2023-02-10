import { Component } from "react";
import Cookies from "universal-cookie";
import { Button } from "react-bootstrap";

export default function Logout() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    const logout = (e) => {
        console.log(e);
        cookies.remove("TOKEN", { path: "/" });
        window.location.href = "/";
    }

    return (
        <div className="logout-container">
            <Button 
                type="submit" 
                variant="outline-primary"
                onClick={() => logout()}
            >
                Logout
            </Button>
        </div>
    );
}