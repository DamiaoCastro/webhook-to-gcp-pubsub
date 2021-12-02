import { PubSub } from "@google-cloud/pubsub";
const grpc = require('grpc');

export class Publisher {

    private readonly pubSubClient = new PubSub({ grpc });
    private readonly topicName: string;

    /**
     *
     */
    constructor(projectId: string, topicId: string) {
        this.topicName = `projects/${projectId}/topics/${topicId}`;
    }

    public publishMessageAsync = async (message: string) => {

        const data = Buffer.from(message);
        const messageId = await this.pubSubClient.topic(this.topicName).publishMessage({ data });
        console.log(`Message ${messageId} published.`);

    };

}