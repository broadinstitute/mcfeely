const test = require('ava');

const testConfig = new (require('./test_config')).TestConfig();
const parser = new (require('../parser')).Parser(testConfig);

const unparseable = [null, "", "{}", JSON.stringify({"foo": "bar"})];

test('unparseable notification messages', t => {
    unparseable.forEach(value => {
            t.throws(() => parser.parse(value), null, value);
        }
    );
});

// from rawls-model
// case class ActivationNotification(recipientUserId: RawlsUserSubjectId) extends UserNotification
// case class WorkspaceAddedNotification(recipientUserId: RawlsUserSubjectId, accessLevel: String, workspaceName: WorkspaceName, workspaceOwnerId: RawlsUserSubjectId) extends UserNotification
// case class WorkspaceRemovedNotification(recipientUserId: RawlsUserSubjectId, accessLevel: String, workspaceName: WorkspaceName, workspaceOwnerId: RawlsUserSubjectId) extends UserNotification
// case class WorkspaceInvitedNotification(recipientUserEmail: RawlsUserEmail, requesterId: RawlsUserSubjectId, workspaceName: WorkspaceName, bucketName: String) extends Notification
// case class WorkspaceChangedNotification(recipientUserId: RawlsUserSubjectId, workspaceName: WorkspaceName) extends WorkspaceNotification
// case class GroupAccessRequestNotification(recipientUserId: RawlsUserSubjectId, groupName: String, replyToIds: Set[RawlsUserSubjectId], requesterId: RawlsUserSubjectId) extends Notification

const validNotifications = [
    {
        notificationType: 'ActivationNotification',
        recipientUserId: 'a user subject id'
    },
    {
        notificationType: 'WorkspaceAddedNotification',
        recipientUserId: 'a user subject id',
        accessLevel: 'OWNER',
        workspaceName: {
            name: 'work',
            namespace: 'space'
        },
        workspaceOwnerId: 'an owner id'
    },
    {
        notificationType: 'WorkspaceRemovedNotification',
        recipientUserId: 'a user subject id',
        accessLevel: 'OWNER',
        workspaceName: {
            name: 'work',
            namespace: 'space'
        },
        workspaceOwnerId: 'an owner id'
    },
    {
        notificationType: 'WorkspaceInvitedNotification',
        recipientUserEmail: 'a user email',
        requesterId: 'a requester ID',
        workspaceName: {
            name: 'work',
            namespace: 'space'
        },
        bucketName: 'my bucket'
    },
    {
        notificationType: 'WorkspaceChangedNotification',
        recipientUserId: 'a user subject id',
        workspaceName: {
            name: 'work',
            namespace: 'space'
        }
    },
    {
        notificationType: 'GroupAccessRequestNotification',
        recipientUserId: 'a user subject id',
        groupName: 'the group',
        replyToIds: [
            'a user subject id',
            'another'
        ],
        requesterId: 'a requester ID'
    }
];

validNotifications.forEach( notification => {
    test(notification.notificationType, t => {
        const result = parser.parse(JSON.stringify(notification));
        t.is(result.notificationId, testConfig.notificationTemplateMap[notification.notificationType])
    })
});

/*
TODO fill these out and consider how to best deal with errors
const invalidNotifications = [
    {
        notificationType: 'invalid'
    },
    {
        notificationType: 'ActivationNotification'
        // missing -> recipientUserId: 'a user subject id'
    },

];

test('invalid notification messages', t => {
    invalidNotifications.forEach( notification => {
        t.throws(() => parser.parse(JSON.stringify(notification)), null, notification.notificationType);
    })
})
 */
