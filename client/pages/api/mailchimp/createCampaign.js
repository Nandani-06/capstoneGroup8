// API route to create an email campaign using Mailchimp API

import mailchimp, { configureMailchimp } from "@/utils/mailchimpConfig";

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { templateId, templateName } = req.body; // Extract templateId and templateName
      const segments = await mailchimp.lists.listSegments(process.env.MAILCHIMP_AUDIENCE_ID);
      console.log("Available Segments:", segments);

    
      try {
        configureMailchimp(); // Set up Mailchimp API configuration

        // Use API with given request body
        const campaign = await mailchimp.campaigns.create({
          type: "regular", 
          recipients: {
            list_id: process.env.MAILCHIMP_AUDIENCE_ID,
          },
          settings: {
            subject_line: `Template: ${templateName || "Default Subject"}`, // subject required
            from_name: "Ammad", // from name required
            reply_to: "23853569@student.uwa.edu.au", // from email required

          }
          
        });
        
        //  template_id: 10019181 
        // set campaign content is separate, check API docs, must use different function


        // Log if campaign created 
        console.log("Campaign created successfully:", campaign);
        res.status(200).json({ message: "Campaign created and sent successfully!" });
        
        // Send campaign
        // await mailchimp.campaigns.send(campaign.id);
  
      // Error codes to help debug and catch failures
      } catch (error) {
        console.error("Error creating or sending campaign:", JSON.stringify(error.response?.body, null, 2));
        res.status(400).json({
          error: "Failed to create or send campaign",
          details: error.response?.body || error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
  