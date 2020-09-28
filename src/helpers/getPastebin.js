import axios from "axios"

export async function getPastebinWithTimeout(body, timeout) {
    return new Promise(function (resolve, reject) {
        getPastebin(body).then(resolve, reject)
        setTimeout(function () {
            reject(new Error("Timed out, because Pastebin API took too long to respond."))
        }, timeout)
    })
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

// Upload arg string to pastebin and return url
async function getPastebin(body) {


    // Pastebin api didn't work for some reason.
    // I'm always getting the error: "Bad API request, invalid api_dev_key"
    // SOLUTION: You need to pass all the data under the "form" key (or whatever the terminology is) else it's not recognized by the api
    //  (When you use curl and pass data with -d it's also passed under the "form" key instead of the "data" key... )
    //  To pass stuff under the "form" key using axios you need to create a new FormData object and pass that as data to axios.post
    //  I'm very confused but hey it works!

    // Stuff that's not so great about this solution:
    // Each IP can only create 10 pastes on pastebin.com per day, after that a cryptic error message will be returned instead of the pastebin url.
    //   If that happens we just throw an error

    console.log("Uploading to pastebin...")

    // Define some constants

    // CORS Proxy
    const CORSProxyURL = "https://mmf-cors-proxy.noah-nuebling.workers.dev/?"
    //const CORSProxyURL = "https://mmf-cors-proxy-2.noah-nuebling.workers.dev/?"
    //const CORSProxyURL = "https://cors-anywhere.herokuapp.com/"
    //const CORSProxyURL = ""

    // Base url
    const baseURL = "https://pastebin.com/api/api_post.php"

    // API key
    const apiKey = "SZxwVigJOFMVBAQCLs3HoZpHjrEQo53L" // KlamuserKai's key // Don't abuse hos key or you'll be eaten by cave trolls
    //const apiKey = "rC1P3TfFhNgvpNoIWh5uEli0diQEh4m9"

    // Collect data for POST request

    // URL
    let url = CORSProxyURL + baseURL

    // Data
    let data = new FormData()
    data.append("api_dev_key", apiKey)
    data.append("api_option", 'paste')
    data.append("api_paste_code", body)

    // Config
    let config = {}

    // Send POST request

    const response = await axios.post(url, data, config)
    console.log("Server response:", response)

    // Return url of created paste

    // Throw error if response is not a valid url
    if (!validURL(response.data)) {
        throw Error("The server didn't return a valid url. Instead it returned: " + response.data)
        // throw Error("The server didn't return a valid url. Instead it returned:", response.data)
    }

    return response.data

}

// ---

// v Tried to use other pastebin platforms but there were issues with all the ones I tried, and pastebin.com works now

// console.log("Getting hastebin...")
// Hastebin is incredibly slow sometimes (rn takes like 30 seconds to respond with a 503) - might be overloaded
// It's staying slow af ... Using 'https' instead of 'http' makes it faster, but the server response is weird

// const baseURL = "http://hastebin.com/documents/"
// const response = await axios.post(CORSProxyURL + baseURL, body)
// console.log("Server response:", response)
// return baseURL + response.data.key

// Creating ghostbin

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