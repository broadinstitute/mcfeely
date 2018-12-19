# mcfeely
McFeely listens to a PubSub topic for email notification requests and passes them on to SendGrid for delivery.

### Development Quickstart
McFeely is implemented using **Node.js version 8**.  Follow 
[this guide](https://cloud.google.com/nodejs/docs/setup) to set up your Node development 
environment.  To execute unit tests, run `npm install` and `npm test` from the `function` directory.

### Architecture

`index.js` is the entry point which is triggered by the receipt of a PubSub message, which calls
the following functions in order:

`parsePubSub.parse()` takes the contents of the PubSub message and extracts the relevant fields 
from the different Workbench (Rawls) Notification types.

`resolver.lookup()` retrieves necessary values from the profile service (Alicia) and returns a 
normalized structure

`sendGrid.email()` formats the normalized notification structure for SendGrid and sends it