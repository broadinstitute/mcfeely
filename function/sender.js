const sender = require('sendgrid');

class Sender {
    constructor(sendGridConfig) {
        this.sendGridApiKey = sendGridConfig.sendGridApiKey;
        this.substitutionChar = sendGridConfig.substitutionChar;
        this.defaultFromAddress = sendGridConfig.defaultFromAddress;
        this.defaultFromName = sendGridConfig.defaultFromName;
    }

    email(email) {
        // comment from Thurloe:
        // subject and body must be set even if the value isn't used.
        // Supposedly this will be fixed in a future version of SendGrid

        const emptyButRequired = ' ';

        return Promise.resolve().then(() => {
            const client = sender(this.sendGridApiKey);

            const request = client.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    personalizations: [
                        {
                            to: [
                                {
                                    email: email.resolveTo,
                                },
                            ],
                            subject: emptyButRequired,
                        },
                    ],
                    from: {
                        email: this.defaultFromAddress,
                        name: this.defaultFromName,
                    },
                    content: [
                        {
                            type: 'text/plain',
                            value: emptyButRequired
                        },
                    ],
                    template_id: email.notificationId,
                    headers: this.replyToHeader(email.replyTos),
                    substitutions: this.wrapSubstitutions(email)
                }
            });

            return client.API(request);
        });
        // TODO: error handling
    }

    replyToHeader(replyTos) {
        if (!replyTos) {
            return {}
        }

        return {'Reply-To': replyTos.join(', ')}
    }

    wrapSubstitutions(email) {
        // TODO: is there a more functional way to do this?
        const wrappedSubs = {};

        Object.keys(email.resolvedSubstitutions).forEach(subKey => {
            const wrappedKey = `${this.substitutionChar}${subKey}${this.substitutionChar}`;
            wrappedSubs[wrappedKey] = email.resolvedSubstitutions[subKey]
        });

        return wrappedSubs;
    }
}

exports.Sender = Sender;