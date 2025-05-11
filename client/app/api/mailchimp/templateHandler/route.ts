// API route to fetch templates from Mailchimp user account

import { NextResponse } from "next/server";
import mailchimp, { configureMailchimp } from "@/utils/mailchimpConfig";

export const GET = async () => {
    try {
        configureMailchimp(); // Configure API keys

        const response = await mailchimp.templates.list();
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error fetching templates:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates", details: error.message },
            { status: 500 }
        );
    }
};
