import { Metadata } from "grpc";

const TIMEOUT: number = 10;

export function getTimeOut(): Metadata {
    const metadata: Metadata = new Metadata();
    const timeout: number = new Date().setSeconds(new Date().getSeconds() + TIMEOUT);
    metadata.set("deadline", timeout.toString());

    return metadata;
}
