// Shared function for setting up Mailchimp API configuration 

import mailchimp from "@mailchimp/mailchimp_marketing";

export const configureMailchimp = () => {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY, // Load from environment variables
    server: process.env.MAILCHIMP_SERVER_PREFIX, // Load server prefix
  });
};

export default mailchimp;
