const stripe = require("stripe")("sk_test_51QVEcuFZsKu3gKZXb2hKPiDmT34H1XMBfKqiaWtCJNRKUwabWiEVZWiHYSMGn7oxX5VrBwSDRiWhuG0VnK1GDyDV00jqQUy2Dp");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send({ success: false, error: "Method not allowed. Use POST." });
    }

    try {
        let customerId;

        // Gets the customer whose email ID matches the one sent by the client
        const customerList = await stripe.customers.list({
            email: req.body.email,
            limit: 1,
        });

        // Checks if the customer exists; if not, creates a new customer
        if (customerList.data.length !== 0) {
            customerId = customerList.data[0].id;
        } else {
            const customer = await stripe.customers.create({
                email: req.body.email,
            });
            customerId = customer.id;
        }

        // Creates a temporary secret key linked with the customer
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: "2020-08-27" }
        );

        // Creates a new payment intent with the amount passed in from the client
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(req.body.amount),
            currency: "usd",
            customer: customerId,
        });

        res.status(200).send({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customerId,
            success: true,
        });
    } catch (error) {
        res.status(400).send({ success: false, error: error.message });
    }
};

