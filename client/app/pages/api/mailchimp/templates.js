import client from "@mailchimp/mailchimp_marketing";


client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

const run = async () => {
  const response = await client.templates.list();
  console.log(response);
};

run();





  
  // );
  
  // export default async function handler(req, res) {
  //   try {
  //     // Fetch templates
  //     const response = await mailchimpClient.templates.list();
  //     res.status(200).json(response); // Send back the template list
  //   } catch (error) {
  //     console.error("Error fetching Mailchimp templates:", error);
  //     res.status(500).json({ error: "Failed to fetch templates" });
  //   }
  // }
  