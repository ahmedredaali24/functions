const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { amount } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // المبلغ بالـ سنتات
        currency: 'usd',
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
