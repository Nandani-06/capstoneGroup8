// Function for setting up Mailchimp API configuration 

import mailchimp from "@mailchimp/mailchimp_marketing";

export const configureMailchimp = (): void => {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY as string, // Load from environment variables
    server: process.env.MAILCHIMP_SERVER_PREFIX as string, // Load server prefix
  });
};

export default mailchimp;