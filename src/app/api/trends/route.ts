import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB || "healthcareDB";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("papers");

    const result = await collection
      .aggregate([
        { $match: { year: { $ne: null } } },
        { $group: { _id: "$year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
