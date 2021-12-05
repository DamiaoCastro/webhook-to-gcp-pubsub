import { PubSub } from "@google-cloud/pubsub";
const grpc = require('grpc');

export class PubSubPublisher {

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

    public publishMessageAsync = async (message: string) => {

        const data: Buffer = Buffer.from(message);
        const messageId = await this.pubSubClient.topic(this.topicName).publishMessage({ data });
        console.log(`Message ${messageId} published.`);

    };

}