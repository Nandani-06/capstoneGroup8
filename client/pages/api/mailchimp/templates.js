import mailchimp, { configureMailchimp } from "@/utils/mailchimpConfig";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      configureMailchimp(); // Set up Mailchimp configuration
      const response = await mailchimp.templates.list();
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
