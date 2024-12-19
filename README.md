# Chat-Ur-Meyts X

## Welcome to your Expo app 👋

This is an Expo project that uses Supabase for backend services, and a custom backend for recommendation.

### Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed the latest version of Node.js and npm.
- You can access services provided by Supabase on your network.

### Running the Project

To run this project, follow these steps:

1. Clone the repository

```
git clone https://github.com/lonewanderer27/chaturmeytsx
```

2. Install the dependencies:
```
cd chaturmatesx
npm install
// or bun install if you are using bun
```

3. Create a .env file in the root directory of the project and add the following variables:
```
VITE_SUPABASE_ANON_KEY=<project_supabase_anon_key>
VITE_SUPABASE_API_URL=<project_supabase_api_url>
VITE_RECOMMEND_BACKEND=<project_recommend_backend_api_url>
```

Replace <your_supabase_anon_key>, <your_supabase_api_url>, <project_recommend_backend_api_url> with our actual keys and IDs.

4. Enable USB Debugging in your Developer Options. Connect your PC to the phone using ADB.

5. Start the android app:
```
npm run android-dev
// or bun dev if you are using bun
```
The application should now be running in your phone via ADB.
Please make sure that the recommend backend is running as well.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Contributing to Chaturmates

To contribute, follow these steps:
1. Fork this repository to your github account.
2. Create new branch: `git checkout -b <new_branch_name>`
3. Make your changes and commit them: `git commit -m '<commit_message>'
4. Push to the new branch and your new repository: `git push origin`
5. Create the pull request in the original github repository.

### Contact
If you want to contact me you can reach me at adrianejames27@gmail.com

### License
This project uses the GPL-v3 License.
