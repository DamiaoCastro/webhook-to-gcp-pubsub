import { PubSub, TestIamPermissionsResponse } from "@google-cloud/pubsub";
const grpc = require('grpc');

export class PubSubPublisher implements IPubsubPublisher {

    private static readonly ProjectIdEnvironmentKey: string = 'PROJECT_ID';
    private static readonly TopicIdEnvironmentKey: string = 'TOPIC_ID';

    private readonly pubSubClient = new PubSub({ grpc });
    private readonly topicName: string;

    /**
     *
     */
    constructor(projectId: string, topicId: string) {
        this.topicName = `projects/${projectId}/topics/${topicId}`;
    }

    public static new = (environmentVariables: Dict<string>): PubSubPublisher => {

        const projectId = environmentVariables[PubSubPublisher.ProjectIdEnvironmentKey];
        if (!(projectId && projectId.length > 0)) { throw new Error(`"${PubSubPublisher.ProjectIdEnvironmentKey}" is not defined in the environment variables`); }

        const topicId = environmentVariables[PubSubPublisher.TopicIdEnvironmentKey];
        if (!(topicId && topicId.length > 0)) { throw new Error(`"${PubSubPublisher.TopicIdEnvironmentKey}" is not defined in the environment variables`); }

        return new PubSubPublisher(projectId, topicId);
    };

    public publishMessageAsync = async (contentType: string, data: Buffer): Promise<void> => {

        if (data.length > 0) {

            const attributes = {
                "content-type": contentType
            };

            const messageId = await this.pubSubClient
                .topic(this.topicName)
                .publishMessage({ attributes, data });

            console.log(`Message ${messageId} published.`);
        }

    }

    public async checkPublishPermissionsAsync(): Promise<void> {

        const permissionsToTest = [
            // 'pubsub.topics.attachSubscription',
            'pubsub.topics.publish',
            // 'pubsub.topics.update',
        ];

        const permissionsReponse: TestIamPermissionsResponse = await this.pubSubClient
            .topic(this.topicName)
            .iam.testPermissions(permissionsToTest);

        if (permissionsReponse[0]) {
            console.info('publish permissions verified');
        } else {
            throw new Error('service account has no publish permissions');
        }
    }

}