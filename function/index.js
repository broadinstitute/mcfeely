const config = new (require('./config')).Config();
const parser = new (require('./parser')).Parser(config);
const resolver = new (require('./resolver')).Resolver(config);
const sender = new (require('./sender')).Sender(config.sendgrid);

/**
 * adapted from https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/node8
 *
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.mcfeely = (data, context) => {
  const receivedMessage = Buffer.from(data.data, 'base64').toString();
  console.log(`Received PubSub message ${JSON.stringify(receivedMessage)}`);

  const parsedNotification = parser.parse(receivedMessage);
  console.log(`Parsed notification as ${JSON.stringify(parsedNotification)}`);

  const normalizedNotification = resolver.lookup(parsedNotification);
  console.log(`Resolved and normalized notification as ${JSON.stringify(normalizedNotification)}`);

  //sender.email(normalizedNotification);
  //console.log(`Sent email`);
};
