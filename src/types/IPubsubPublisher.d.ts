interface IPubsubPublisher {

    publishMessageAsync(contentType: string, data: Buffer): Promise<void>;

    checkPublishPermissionsAsync(): Promise<void>;
    
}