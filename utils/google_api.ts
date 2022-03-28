import * as path from 'path';
import readline from 'readline';
import {calendar_v3, google} from 'googleapis';
import {OAuth2Client} from 'google-auth-library'

const fs = require('fs');

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly',
];
// const projectId = 'medi-live';
// const authUri = "https://accounts.google.com/o/oauth2/auth";
// const tokenUri = "https://oauth2.googleapis.com/token";
// const auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs";
const TOKEN_PATH = 'token.json';

const filename: string = path.resolve(process.cwd(), 'credentials.json');

// fs.readFile(filename, (err: NodeJS.ErrnoException|null, content: Buffer) => {
//     if (err) return console.log('Error loading client secret file: ', err);
//
// })
type CredentialContainer = {
    web: Credential;
}
type Credential = {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    javascript_origins: string[];

}
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const clientId = process.env.GOOGLE_CLIENT_ID;

// const url = oAuth2Client.generateAuthUrl({access_type: 'offline', scope: scopes})

function foo() {

// Load client secrets from a local file.
    fs.readFile(filename, (err: NodeJS.ErrnoException|null, content: Buffer) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        const credential: CredentialContainer = JSON.parse(content.toString());
        authorize(credential, listEvents);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {CredentialContainer} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: CredentialContainer, callback: Function) {
    const { client_secret, client_id } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err: NodeJS.ErrnoException|null, token: Buffer) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        token = JSON.parse(token.toString())
        // @ts-ignore
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {function} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client: OAuth2Client, callback: Function) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err: any, token: any) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: NodeJS.ErrnoException|null) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {OAuth2Client} auth An authorized OAuth2 client.
 */
function listEvents(auth: OAuth2Client) {

    const calendar = google.calendar({version: 'v3', auth});
    // const res = calendar.calendarList.list()
    calendar.events.list({
        calendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err || !res) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events && events.length) {
            let evts = events.map((event) => {
                const start = event?.start?.date;
                const summary = event?.summary;
                return {start, summary};
            });
            fs.writeFile('holidays.json', JSON.stringify(evts), (err: NodeJS.ErrnoException|null) => {
                if (err) console.log(err);
            })
        } else {
            console.log('No upcoming events found.');
        }
    });
}

export { foo };