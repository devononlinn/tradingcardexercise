import React, { useState, useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function AddCardModalComponent({ isOpen, data, onDataChange, onClose }) {
    const formRef = useRef(null);
    const [image, setImage] = useState("");

    const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64Img = await convertBase64(file);
        setImage(base64Img);
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    function checkPrice(event) {
        let number = event.target.value;
        if (!/^\d+\.\d{2}$/.test(number)) {
            number = parseFloat(number).toFixed(2);
        }
        event.target.value = number;
    }

  const reload=()=>window.location.reload();

  return (
    <Modal style={{opacity:1}} show={isOpen} onHide={onClose} onExit={reload} centered>
        <Modal.Header closeButton>
            <Modal.Title>Add New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* Display the data */}
            <Form ref={formRef}>
                <Form.Group controlId="formBasicCardName">
                    <Form.Label>Card Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter card name"
                        name="cardName"
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCardDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Description"
                        name="cardDescription"
                        maxLength="60"
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Price"
                        name="price"
                        onBlur={checkPrice}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="image"
                        onChange={(e) => uploadImage(e)}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    onClick={async (e) => {
                    e.preventDefault();
                    onDataChange({
                    cardName: formRef.current.elements["cardName"].value,
                    cardDescription: formRef.current.elements["cardDescription"].value,
                    price: formRef.current.elements["price"].value,
                    image,
                    });
                    onClose();
                    }}
                >
                    Upload
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
  );
}