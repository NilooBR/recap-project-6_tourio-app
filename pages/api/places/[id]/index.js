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

  if (request.method === "PUT") {
    try {
      const updatedPlace = request.body;
      const result = await Place.findByIdAndUpdate(id, updatedPlace);

      if (!result) {
        return response.status(404).json({ status: "Place not found" });
      }

      return response
        .status(200)
        .json({ status: "Place successfully updated", data: result });
    } catch (error) {
      console.error("Error updating place:", error);
      return response
        .status(500)
        .json({ status: "Internal server error", error: error.message });
    }
  }

  if (request.method === "DELETE") {
    try {
      await Place.findByIdAndDelete(id);
      response.status(260).json("Place successfully deleted");
      return;
    } catch (error) {
      console.error("Error updating place:", error);
      return response
        .status(500)
        .json({ status: "Internal server error", error: error.message });
    }
  }
}
