import { MONGODB_URI } from "@/config/config";
import { MongoClient } from "mongodb";


let cachedClient: MongoClient | null=null;

export async function connectToDB(): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    const uri = MONGODB_URI;
    const client = await MongoClient.connect(uri!);

    cachedClient = client;
    return client;
}