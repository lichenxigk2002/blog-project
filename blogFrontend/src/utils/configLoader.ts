// import yaml from 'js-yaml';
// import fs from 'fs';
// import path from 'path';

// let homeConfig: any = null;
// let profileConfig: any = null;

// export const loadHomeConfig = () => {
//     if (homeConfig) return homeConfig;

//     try {
//         const configPath = path.join(process.cwd(), 'src/content/home-page.yml');
//         const fileContents = fs.readFileSync(configPath, 'utf8');
//         homeConfig = yaml.load(fileContents);
//         return homeConfig;
//     } catch (error) {
//         console.error('Failed to load home config:', error);
//         return {};
//     }
// };

// export const getHomeConfig = (key: string): any => {
//     const config = loadHomeConfig();
//     return key.split('.').reduce((obj: any, k: string) => obj?.[k], config);
// };

// export const loadProfileConfig = () => {
//     if (profileConfig) return profileConfig;

//     try {
//         const configPath = path.join(process.cwd(), 'src/content/profile-card.yml');
//         const fileContents = fs.readFileSync(configPath, 'utf8');
//         profileConfig = yaml.load(fileContents);
//         return profileConfig;
//     } catch (error) {
//         console.error('Failed to load profile config:', error);
//         return {};
//     }
// };

// export const getProfileConfig = (key: string) => {
//     const config = loadProfileConfig();
//     return key.split('.').reduce((obj: any, k: string) => obj?.[k], config);
// };