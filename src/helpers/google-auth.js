import config from "../config";

export async function componentDidMount() {
    // 1. Load the JavaScript client library.
    async function wrapLoad() {
        return new Promise((resolve, reject) => {
            let return_val = '';
            window.gapi.load("client", () => {
                return_val = initClient();
                resolve(return_val);
            });
        });
    }
    return await wrapLoad();
}

async function initClient () {
    function wrapInit() {
        return new Promise((resolve, reject) => {
            //2. Initialize the JavaScript client library.
            window.gapi.client.init({
                apiKey: config.apiKey,
                clientId: config.clientId,
                scope: config.scopes,
                // Your API key will be automatically added to the Discovery Document URLs.
                discoveryDocs: config.discoveryDocs
            });
            resolve(true)
        })
    }
    return await wrapInit();
}

export function loadSheetsAPI() {
    return new Promise((resolve, reject) => {
        window.gapi.client.load("sheets", "v4", () => {
            resolve(true);
        });
    });
}

