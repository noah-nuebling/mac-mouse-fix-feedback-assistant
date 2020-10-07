import axios from "axios"

function getInvalidURLErr(url) {
    return new Error("The server didn't return a valid url. Instead it returned: " + url) // This line seems to cause jekyll compilation error for some reason
}

export async function getPastebinWithTimeout(body, timeout) {
    return new Promise(function (resolve, reject) {
        getPastebin(body).then(resolve, reject)
        setTimeout(function () {
            reject(new Error("Timed out, because Pastebin API took too long to respond."))
        }, timeout)
    })
}

// Upload arg string to pastebin and return url
async function getPastebin(body) {

    // Define CORS Proxy

    // Top 10 free CORS proxies: https://nordicapis.com/10-free-to-use-cors-proxies/

    const CORSProxyURL_CloudFlare = "https://mmf-cors-proxy.noah-nuebling.workers.dev/?" // Should be fastest
    //const CORSProxyURL_CloudFlare= "https://mmf-cors-proxy-2.noah-nuebling.workers.dev/?" // Should be just as fast
    // ^ All these cloudflare workers seem to have the same IP. Each ip can only create 10 pastes per day with the pastebin.com api... :/
    const CORSProxyURL_Heroku = "https://cors-anywhere.herokuapp.com/" // Pretty slow but public and maintained by someone else
    const CORSProxyURL_None = "" //  For testing

    // Upload to some pastebin

    let pasteURL = ''
    try {
        // Try to upload to pastebin.com
        pasteURL = await getPastebinDotCom(CORSProxyURL_CloudFlare, body);
        if (!validURL(pasteURL)) {
            throw getInvalidURLErr(pasteURL)
        }
    } catch (e) {
        // Try to upload to hastebin.com
        console.log('Error while trying to upload to pastebin.com.', e)
        console.log('Trying hastebin.com instead.')
        pasteURL = await getHastebinDotCom(CORSProxyURL_CloudFlare, body);
    }

    // Throw error if response is not a valid url
    if (!validURL(pasteURL)) {
        throw getInvalidURLErr(pasteURL)
    }

    // Return
    return pasteURL

}

async function getPastebinDotCom(CORSProxyURL, body) {

    // Pastebin api didn't work for some reason.
    // I'm always getting the error: "Bad API request, invalid api_dev_key"
    // SOLUTION: You need to pass all the data under the "form" key (or whatever the terminology is) else it's not recognized by the api
    //  (When you use curl and pass data with -d it's also passed under the "form" key instead of the "data" key... )
    //  To pass stuff under the "form" key using axios you need to create a new FormData object and pass that as data to axios.post
    //  I'm very confused but hey it works!

    // Stuff that's not so great about this solution:
    // Each IP can only create 10 pastes on pastebin.com per day, after that a cryptic error message will be returned instead of the pastebin url.
    //   Callers can check if this happened with validURL()

    console.log("Uploading to pastebin...")

    // Defining some constants

    // Base url
    const baseURL = "https://pastebin.com/api/api_post.php"

    // API key
    const apiKey = "SZxwVigJOFMVBAQCLs3HoZpHjrEQo53L" // KlamuserKai's key // Don't abuse his key or you'll be eaten by cave trolls
    //const apiKey = "dY-a4YprdKatsKqvQWPoza3Mui4seCMQ" // Noah's key

    // Collect data for POST request

    // URL
    let url = CORSProxyURL + baseURL

    // Data
    let data = new FormData()
    data.append("api_dev_key", apiKey)
    data.append("api_option", 'paste')
    data.append("api_paste_code", body)
    data.append("api_paste_private", '1') // 0: public, 1: unlisted, 2: private

    // Config
    let config = {}

    // Send POST request
    const response = await axios.post(url, data, config)
    console.log("Server response:", response)

    // Return url of created paste
    return response.data
}

async function getHastebinDotCom(CORSProxyURL, body) {

    // Hastebin is incredibly slow sometimes (rn takes like 30 seconds to respond with a 503) - might be overloaded, or maybe it blacklisted my ip due to testing

    console.log("Uploading to hastebin...")

    const baseURL = "https://hastebin.com/"
    const response = await axios.post(CORSProxyURL + baseURL + "documents/", body)
    console.log("Server response:", response)

    const responseURL = baseURL + response.data.key

    return responseURL
}

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

// ---

// v Tried to use other pastebin platforms

// Uploading to ghostbin

// const baseURL = "https://ghostbin.com/paste/new"
//
// let data = new FormData()
// data.append("text" ,body)
//
// const response = await axios.post(CORSProxyURL + baseURL, data, {
//     'Content-Type': 'multipart/form-data'
// })

// const response = await request.post({
//     url: CORSProxyURL + baseURL,
//     form: {
//         text: "AMAZING TEST MESSAGE"
//     },
//     headers: {
//         'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
//     }
// })

// console.log("Server response:", response)
//
// return

// Requesting httpbin for testing