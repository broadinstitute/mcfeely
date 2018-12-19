// parse the notification from PubSub and extract appropriate values for each type

class Parser {
    constructor(config) {
        this.fireCloudPortalUrl = config.fireCloudPortalUrl;
        this.notificationTemplateMap = config.notificationTemplateMap;
    }

    parse(toParse) {
        const notification = JSON.parse(toParse);
        const type = notification.notificationType;
        const templateId = this.notificationTemplateMap[type];

        // TODO: how do we keep these in sync with RawlsModel?
        switch (type) {
            case 'ActivationNotification':
                return {
                    userId: notification.recipentUserId,
                    notificationId: templateId,
                    substitutions: {},
                    emailLookupSubstitutions: {},
                    nameLookupSubstitution: {}
                }

            case 'WorkspaceAddedNotification':
                return {
                    userId: notification.recipentUserId,
                    replyTos: [notification.workspaceOwnerId],
                    notificationId: templateId,
                    substitutions: {
                        accessLevel: notification.accessLevel,
                        namespace: notification.workspaceName.namespace,
                        name: notification.workspaceName.name,
                        wsUrl: this.workspacePortalUrl(notification.workspaceName)
                    },
                    emailLookupSubstitutions: {
                        originEmail: notification.workspaceOwnerId
                    },
                    nameLookupSubstitution: {
                        userNameFL: notification.workspaceOwnerId
                    }
                }

            case 'WorkspaceRemovedNotification':
                // TODO only difference from above is notificationId
                return {
                    userId: notification.recipentUserId,
                    replyTos: [notification.workspaceOwnerId],
                    notificationId: templateId,
                    substitutions: {
                        accessLevel: notification.accessLevel,
                        namespace: notification.workspaceName.namespace,
                        name: notification.workspaceName.name,
                        wsUrl: this.workspacePortalUrl(notification.workspaceName)
                    },
                    emailLookupSubstitutions: {
                        originEmail: notification.workspaceOwnerId
                    },
                    nameLookupSubstitution: {
                        userNameFL: notification.workspaceOwnerId
                    }
                }

            case 'WorkspaceInvitedNotification':
                return {
                    userEmail: notification.recipientUserEmail,
                    replyTos: [notification.requesterId],
                    notificationId: templateId,
                    substitutions: {
                        wsName: notification.workspaceName.name,
                        wsUrl: this.workspacePortalUrl(notification.workspaceName),
                        bucketName: notification.bucketName,
                        bucketUrl: Parser.bucketUrl(notification.bucketName)
                    },
                    emailLookupSubstitutions: {
                        originEmail: notification.requesterId
                    },
                    nameLookupSubstitution: {
                        userNameFL: notification.requesterId
                    }
                }

            case 'WorkspaceChangedNotification':
                return {
                    userId: notification.recipentUserId,
                    notificationId: templateId,
                    substitutions: {
                        wsName: notification.workspaceName.name,
                        wsUrl: this.workspacePortalUrl(notification.workspaceName)
                    },
                    emailLookupSubstitutions: {},
                    nameLookupSubstitution: {}
                }

            case 'GroupAccessRequestNotification':
                return {
                    userId: notification.recipentUserId,
                    replyTos: notification.replyToIds,
                    notificationId: templateId,
                    substitutions: {
                        groupName: notification.groupName,
                        groupUrl: this.groupManagementUrl(notification.groupName)
                    },
                    emailLookupSubstitutions: {
                        originEmail: notification.requesterId
                    },
                    nameLookupSubstitution: {
                        userNameFL: notification.requesterId
                    }
                }

            default:
                throw Error(`Unknown notification type: ${type}`)
        }

    }

    workspacePortalUrl(workspaceName) {
        return `${this.fireCloudPortalUrl}/#workspaces/${workspaceName.namespace}/${workspaceName.name}`
    }

    static bucketUrl(bucketName) {
        return `https://console.cloud.google.com/storage/browser/${bucketName}`
    }

    groupManagementUrl(groupName) {
        return `${this.fireCloudPortalUrl}/#groups/${groupName}`
    }
}

exports.Parser = Parser;
