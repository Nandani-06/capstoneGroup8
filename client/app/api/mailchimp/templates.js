import client from "@mailchimp/mailchimp_marketing"

client.setConfig({
  apiKey:process.env.MAILCHIMP_API_KEY,
  server:process.env.MAILCHIMP_SERVER_PREFIX
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await client.templates.list();
      res.status(200).json(response); // Return templates
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
