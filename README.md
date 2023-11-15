
# Webflow Hybrid App Starter

Welcome to the Webflow Hybrid App Starter! Inspired by the comprehensive work of the Webflow team, this template is a slimmed down adaptation of their [Hybrid App Example](https://github.com/Webflow-Examples/Hybrid-App-Example). It's designed to help you kickstart the development of hybrid Webflow apps (Webflow integrations) for the Webflow platform.

## Getting Started

Before you begin, make sure you have the following prerequisites:

- Node.js (version 18.17+): This starter requires a newer version of Node due to its reliance on Next.js.
- A Webflow site ready for testing.
- An already registered Webflow app. For setup instructions, refer to [Step 1 of this tutorial](https://inside.lunchpaillabs.com/setting-up-webflow-s-hybrid-app-example-locally-with-ngrok#step-1-configure-webflow-app).
- Ngrok or a similar URL forwarding service for development. For setup details, consult [Step 3 of this tutorial](https://inside.lunchpaillabs.com/setting-up-webflow-s-hybrid-app-example-locally-with-ngrok#step-3-set-up-ngrok).

Here's how to get everything set up:

1. Clone the repository using this command in your terminal:

   ```sh
   git clone https://github.com/lunchpaillola/webflow-hybrid-app-starter.git
   ```

2. Navigate to the project directory and install dependencies:

   ```sh
   cd webflow-hybrid-app-starter
   npm install
   ```

3. Install the necessary packages in the `data-client` directory:

   ```sh
   # Navigate to /data-client and install dependencies
   cd data-client
   npm install
   ```

4. Install the necessary packages in the `designer-extension` directory:

   ```sh
   # Navigate to /designer-extension and install dependencies
   cd ../designer-extension
   npm install
   ```

5. Copy the `.env.example` file to `.env.local` in both the `data-client` and `designer-extension` directories. Update the environment variables with your CLIENT_ID, CLIENT_SECRET, and backend URL.


## Guides

For a step-by-step and more detailed explanation of what's included in this starter and how to customize it, visit this blog post:

- [Kickstart Webflow Hybrid Apps with This Template](https://inside.lunchpaillabs.com/kickstart-webflow-hybrid-apps-with-this-template)


## Features

- Next.js and TypeScript setup for the designer extension
- Vanilla JavaScript for the data client
- Pre-configured Webflow authentication and API access


## Contribute

If you have ideas for new features or any questions about the project, you can:

- Add your suggestions to the [GitHub repository issues](https://github.com/lunchpaillola/webflow-hybrid-app-starter/issues).


## License

This project is open-sourced under the [MIT license](LICENSE).