const stripe = require('stripe')(process.env.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);

module.exports = async (req, res) => {
    const { amount } = req.body;  // Get amount from request body

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'cad',  // Adjust currency if needed
                    product_data: {
                        name: 'Limo Ride',
                    },
                    unit_amount: amount,  // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
 success_url: 'https://airlinelimousines.com/success',  // Replace with your success URL
            cancel_url: 'https://airlinelimousines.com/cancel',    // Replace with your cancel URL
        });

        // Return the session ID to the client
        res.status(200).json({ id: session.id });
    } catch (error) {
        // Print the detailed error in the console for debugging
        console.error('Error creating Stripe Checkout session:', error);

        // Return a more detailed error to the client for debugging
        res.status(500).json({
            error: 'Failed to create checkout session',
            message: error.message,
            details: error
        });
    }
};
