const functions = require("firebase-functions");
const stripe = require('stripe')("sk_test_51QVEcuFZsKu3gKZXb2hKPiDmT34H1XMBfKqiaWtCJNRKUwabWiEVZWiHYSMGn7oxX5VrBwSDRiWhuG0VnK1GDyDV00jqQUy2Dp");

exports.stripePaymentIntentRequest = functions.https.onRequest(async (requestAnimationFrame, res) => {
  try {
    let customerId;
    const customerList = await stripe.customers.list({
      email: req.body.email,
      limit: 1
    });
    if (customerList.data.length !== 0) {
      customerId = customerList.data[0].id;

    } else {
      const customer = await stripe.customers.create({
        email: req.body.email
      });
      customerId = customer.data.id;
    }
    const ephemeralKey = await stripe.ephemeralKey.create(
      { customer: customerId }, { apiVersion: "2025-01-3" }
    );
    const paymentIntent = await stripe.paymentIntent.create({
      amount: parsenInt(req.body.amount),
      currency: "usd",
      customer: customerId,
    });
    res.status(200).send({
       paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      success: true,
    });
  } catch (erorr) {
    res.status(404).send({ success: false, erorr: erorr.message });
  }
}

);
