import dbConnect from "@/db/connect";
import Place from "@/db/models/Place";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    try {
      const place = await Place.findById(id);
      response.status(200).json(place);
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({ status: "internal server error" });
      return;
    }
  }
}
