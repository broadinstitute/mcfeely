const test = require('ava');

const testConfig = new (require('./test_config')).TestConfig();
const resolver = new (require('../resolver')).Resolver(testConfig);

const id1 = '123';
const id2 = '456';
const template1 = '789';
const template2 = 'ABC';
const user = 'bernick@broad.usa';

const mockProfileService = {
    preferredEmail: function (userId) {
        switch (userId) {
            case id1: return 'test@test.lol';
            case id2: return 'fire@cloud.org';
            default: throw Error('this test is incorrect');
        }
    },
    userName: function (userId) {
        switch (userId) {
            case id1: return 'Alicia McFeely';
            case id2: return 'Red Frogers';
            default: throw Error('this test is incorrect');
        }
    }
};

const cases = [
    {
        parsed: {
            userEmail: user,
            userId: 0, // ignored if userEmail exists
            notificationId: template1
        },
        resolved: {
            toAddress: user,
            replyTos: [],
            notificationId: template1,
            resolvedSubstitutions: {}
        }
    },
    {
        parsed: {
            userId: id2,
            notificationId: template2,
            substitutions: { cat: 'dog' },
            replyTos: [ id1 ],
            emailLookupSubstitutions: { MY_EMAIL: id2 },
            nameLookupSubstitution: { MY_NAME: id2 }
        },
        resolved: {
            toAddress: mockProfileService.preferredEmail(id2),
            replyTos: [ mockProfileService.preferredEmail(id1) ],
            notificationId: template2,
            resolvedSubstitutions: {
                cat: 'dog',
                MY_EMAIL: mockProfileService.preferredEmail(id2),
                MY_NAME: mockProfileService.userName(id2),
            }
        }
    }
];

test('positive test cases', t => {
    cases.forEach(oneTest => {
        t.deepEqual(resolver.lookup(oneTest.parsed, mockProfileService), oneTest.resolved)
    })
});

// TODO negative tests, error checking, etc
