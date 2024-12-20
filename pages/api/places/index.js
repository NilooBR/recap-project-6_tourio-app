import dbConnect from "@/db/connect";
import Place from "@/db/models/Place";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const places = await Place.find();
      return response.status(200).json(places);
    } catch (error) {
      console.error("Error fetching places:", error);
      return response.status(500).json({ status: "error fetching places" });
    }
  }

  if (request.method === "POST") {
    try {
      await Place.create(request.body);
      return response
        .status(201)
        .json({ success: true, status: "Place created" });
    } catch (error) {
      console.error("Error creating place:", error);
      return response
        .status(500)
        .json({ status: "error creating place", error: error.message });
    }
  }

  // If method is not GET or POST, respond with 405
  response.setHeader("Allow", ["GET", "POST"]);
  return response
    .status(405)
    .json({ status: `Method ${request.method} Not Allowed` });
}
