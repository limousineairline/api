const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure you set the secret key in Vercel environment variables
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body;  // Amount should be in cents

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // Example: 5000 cents = $50.00
            currency: 'cad',  // Replace with the currency you're using
        });

        // Send the client secret back to the client
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

module.exports = app;
