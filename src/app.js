// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_KEY);
    const body = event;
    const session = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],

      locale: "es",
      mode: body.mode === "one_time" ? "payment" : "subscription",
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    };
    if (body.customerId) {
      session.customer = body.customerId;
    }
    const sessionResponse = await stripe.checkout.sessions.create(session);
    response = {
      statusCode: 200,
      body: JSON.stringify({ id: sessionResponse.id }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
