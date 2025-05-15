// API route to create and send an email campaign using Mailchimp API

import { NextResponse } from "next/server";
import mailchimp, { configureMailchimp } from "@/utils/mailchimpConfig";


interface RequestBody {
    templateId: string;
    templateName?: string;
}

export const POST = async (req: Request) => {
    if (req.method === "POST") {
        const { templateId, templateName }: RequestBody = await req.json(); // Extract templateId and templateName

        try {
            configureMailchimp(); // Set up Mailchimp API configuration

            const campaign = await mailchimp.campaigns.create({
                type: "regular",
                recipients: {
                    list_id: process.env.MAILCHIMP_AUDIENCE_ID as string,
                },
                settings: {
                    subject_line: `Template: ${templateName || "Default Subject"}`, // subject required
                    from_name: "Ammad", // from name required
                    reply_to: "23853569@student.uwa.edu.au", // from email required
                    template_id: templateId 
                }
            });
          
            // Send campaign
            await mailchimp.campaigns.send(campaign.id);

            // Handle response
            return NextResponse.json(
              { message: "Campaign created and sent successfully", campaignId: campaign.id },
              { status: 200 }
            );

      } catch (error: any) {
          console.error("Error creating or sending campaign:", JSON.stringify(error.response?.body, null, 2));
          return NextResponse.json({
              error: "Failed to create or send campaign",
              details: error.response?.body || error.message,
          }, { status: 400 });
      }
    } else { return new NextResponse(
      JSON.stringify({ error: `Method ${req.method} Not Allowed` }),
      {
        status: 405,
        headers: { 'Allow': 'POST', 'Content-Type': 'application/json' }
      }
      );
    }

}

