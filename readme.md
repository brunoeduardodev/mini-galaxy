# Mini Galaxy

![Project Screenshot](https://github.com/brunoeduardodev/mini-galaxy/assets/50559336/a12de4cb-c94e-402e-b6c5-d81b13174a94)

Mini Galaxy is a cloud-based hosting platform designed for static websites.

# [Try it out](https://mini-galaxy.meteorapp.com)

### Tech Stack

- [Meteor](https://www.meteor.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Mantine UI](https://mantine.dev/)
- [Grubba RPC](https://github.com/Grubba27/meteor-rpc)
- [MongoDB](https://www.mongodb.com/)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)
- [AWS S3](https://aws.amazon.com/s3/)
- [React Router](https://reactrouter.com/)
- [Zod](https://github.com/colinhacks/zod)

### Features

- Deploy your static website to the cloud
- Manage your projects and build configurations
- Authentication with GitHub
- Push to deploy
- Customizable build scripts
- Custom output directory

### Deploying a Static Website

1. Go to the [Hosted App](https://mini-galaxy.meteorapp.com)
2. Click on **Get Started**
3. Sign up with email or password, or using your GitHub account
4. Click on **Deploy First Project**
5. Enter your project name, select a repository, branch
6. If you have a build script, check the box and enter the script and output directory
7. Click on **Create Project**
8. You should be redirect to the project page, with a new build running!

### Running Locally

1. Clone the repository

```bash
git clone https://github.com/brunoeduardodev/mini-galaxy.git
```

2. Install dependencies

```bash
meteor npm install
```

3. Set app settings
   Copy `example-settings.json` to `local.json`
   Update `local.json` with your own settings

4. Start the app

```bash
meteor run -s local.json
```

5. Open your browser and navigate to [localhost:3000](http://localhost:3000)

### Setting up Github App and Github OAuth

1. Go to [Github Apps](https://github.com/settings/apps/new)
2. Fill in the form, for the **Homepage URL** use `http://localhost:3000`, you don't need to fill in anything else
3. Click on **Create Github App**
4. Copy your **App ID** and **Private Key**
5. Go to [Github OAuth](https://github.com/settings/applications/new)
6. Fill in the form, for the **Homepage URL** use `http://localhost:3000`, and for the **Authorization callback URL** you need to setup a [ngrok](https://ngrok.com/) tunnel pointing to http://localhost:3000
7. Copy your **Client ID** and **Client Secret**

### Setting up AWS S3

For setting up AWS S3 for website hosting, you will need to create a service account with full permissions to S3.

Copy the access key and secret access key from the AWS S3 service account.

### Setting up ngrok for Github Webhooks

Install [ngrok](https://ngrok.com/docs/getting-started/?os=macos#step-1-install) and run the following command:

```bash
ngrok http 3000
```

Copy the ngrok URL and paste it in the **Authorization callback URL** field in Github OAuth.
