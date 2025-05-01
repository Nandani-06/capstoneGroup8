import mailchimp, { configureMailchimp } from "@/utils/mailchimpConfig";

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { templateId, templateName } = req.body; // Extract templateId and templateName
      
    
      try {
        configureMailchimp(); // Set up Mailchimp API configuration
        console.log("Received Template ID:", templateId);
        console.log("Audience ID (list_id):", process.env.MAILCHIMP_AUDIENCE_ID);
        const campaign = await mailchimp.campaigns.create({
          type: "regular", 
          recipients: {
            list_id: process.env.MAILCHIMP_AUDIENCE_ID
          },
          settings: {
            subject_line: `Template: ${templateName || "Default Subject"}`, // subject required
            from_name: "Ammad", // from name required
            reply_to: "23853569@student.uwa.edu.au", // from email required
            //  template_id: 10019181 
            // set campaign content is separate, check API docs, must use different function

          }
          
        });

        
          // ,
          // settings: {
          //   subject: `Template: ${templateName || "Default Subject"}`, // Use templateName for subject
          //   from_name: "Ammad",
          //   reply_to: "your-email@example.com",
          //   template_id: templateId, // Required template ID
          // },

        // if (!campaign.settings.subject_line || !campaign.settings.reply_to) {
        //   throw new Error("Campaign is missing required settings");
        // }
  
        console.log("Campaign created successfully:", campaign);
        // await mailchimp.campaigns.send(campaign.id);
  
        res.status(200).json({ message: "Campaign created and sent successfully!" });
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
  