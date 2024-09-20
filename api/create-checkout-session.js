const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin, you can replace '*' with specific domains if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight request response
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'cad',
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
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            message: error.message,
            details: error
        });
    }
};
