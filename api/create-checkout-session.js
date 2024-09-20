const stripe = require('stripe')(process.env.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);  // Use your actual Stripe secret key

module.exports = async (req, res) => {
    const { amount } = req.body;  // Get the amount from the frontend

    try {
        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'cad',  // Use your currency
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

        // Return the session ID to the frontend
        res.status(200).json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};
