const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");
const Card = require("./db/cardModel");
const Cart = require("./db/cartModel");
const ObjectId = require("mongodb").ObjectId;

// Execute db connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json({
  extended: true,
  limit: '16mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// Register endpoint
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPwd) => {
      // password hashed successfully
      const user = new User({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        email: request.body.email,
        password: hashedPwd,
      });
      user.save().then((result) => {
        response.status(201).send({
          message: "User created",
          result,
        });
      })
      .catch((err) => {
        return response.status(500).send({
          message: "Error creating user",
          err,
        })
      });
    })
    .catch((err) => {
      return response.status(500).send({
        message: "Password was not hashed successfully",
        err,
      });
    })
});

// Login endpoint
app.post("/login", (request, response) => {
  // Check if user email exists
  User.findOne({ email: request.body.email })
    .then((user) => {
      // compare user password to hashed pwd in db
      bcrypt.compare(request.body.password, user.password)
        .then((pwdCheck) => {
          // Check if passwords match
          if(!pwdCheck) {
            return response.status(400).send({
              message: "passwords dont match",
              error,
            })
          }
          // Create JWT Token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
            },
            "RANDOM-TOKEN",
            {
              expiresIn: "24h"
            }
          );

          return response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          })
        })
        .catch((err) => {
          return response.status(400).send({
            message: "Passwords do not match",
            err,
          })
        });
    })
    .catch((err) => {
      return response.status(404).send({
        message: "Account doesnt exist",
        err
      })
    })
});

// logged in endpoint
app.get("/member", auth, (request, response) => {
  Card.find({}, (err, result) => {
    if(err) {
      response.status(404).send(err);
    } else {
      response.json({cards: result, user: request.user});
    }
  });
});

app.get("/cart", auth, (request, response) => {
  Cart.find({ user:ObjectId(request.user.userId) }, (err, cartResult) => {
    if(err) {
      console.error(err);
      response.status(404).send(err);
    } else {
      const products = cartResult.map(cart => cart.product);
      Card.find({ _id: { $in: products.map(ObjectId) } }, (err, cardsResult) => {
        if (err) {
          console.error(err);
          response.status(404).send(err);
        } else {
          response.json({cart: cartResult, cards: cardsResult, user: request.user});
        }
      });
    }
  });
});

app.post("/card-submit", auth, (request, response) => {

  const card = new Card({
    user: ObjectId(request.body.userId),
    name: request.body.cardName,
    description: request.body.cardDescription,
    price: request.body.price,
    image: request.body.image,
  });

  card.save().then((result) => {
    response.status(201).send({
      message: "Card Submitted Successfully",
      result,
    });
  })
  .catch((err) => {
    response.status(500).send({
      message: "Error submitting new card",
      err,
    });
    console.error(err, "error submitting new card");
  });

});

app.get("/user-cards", auth, (request, response) => {

  Card.find( { user:ObjectId(request.user.userId) }, (err, result) => {
    if(err) {
      response.status(404).send(err);
    } else {
      response.json(result);
    }
  });
});

app.get("/public", (request, response) => {
  Card.find({}, (err, result) => {
    if(err) {
      response.status(404).send(err);
    } else {
      response.json({cards: result});
    }
  });
});

app.get("/cart", auth, (request, response) => {
  Cart.find({ user:ObjectId(request.user.userId) }, (err, result) => {
    if(err) {
      console.error(err);
      response.status(404).send(err);
    } else {
      response.json({cart: result});
    }
  });
});

/*app.post("/add-to-cart", auth, (request, response) => {
  const cart = new Cart({
    user: ObjectId(request.body.userId),
    product: request.body.product,
    productQuantity: request.body.productQuantity,
  });

  cart.save().then((result) => {
    response.status(201).send({
      message: "Cart Item Submitted Successfully",
      result,
    });
  })
  .catch((err) => {
    response.status(500).send({
      message: "Error submitting new cart item",
      err,
    });
  });
});*/

app.post("/add-to-cart", auth, (request, response) => {
  const filter = {
    user: ObjectId(request.body.userId),
    product: request.body.product
  };
  const update = {
    $inc: {
      productQuantity: request.body.productQuantity
    }
  };
  Cart.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    useFindAndModify: false,
  })
  .then((result) => {
    response.status(201).send({
      message: "Cart Item Submitted Successfully",
      result,
    });
  })
  .catch((err) => {
    response.status(500).send({
      message: "Error submitting new cart item",
      err,
    });
  });
});

app.delete("/remove", auth, (request, response) => {
  Cart.find({ _id: ObjectId(request.body.item) }).deleteOne()
  .then((result) => {
    response.status(201).send({
      message: "Item has been removed from  cart",
      result,
    })
  })
  .catch((err) => {
    response.status(500).send({
      message: "Error removing item from cart",
      err,
    });
    console.error(err, "Didnt remove item from cart");
  });
});

app.put("/update/:id", auth, (request, response) => {
  const cartId = request.params.id.slice(1) || request.body.cartId;
  const quantity = request.body.quantity;

  //update card by id
  Cart.findByIdAndUpdate({ _id:ObjectId(cartId) }, { productQuantity: quantity }, { useFindAndModify: false }, (err, result) => {
    if (err) {
      response.status(404).send({
        message: "Could not update card",
        err,
      });
    } else {
      response.status(200).send({
        message: "Card was updated successfully",
        result,
      });
    }
  });
});

module.exports = app;