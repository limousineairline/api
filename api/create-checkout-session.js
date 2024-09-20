const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Replace with your secret key
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // Amount in cents
            currency: 'cad', // Replace with your currency
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
