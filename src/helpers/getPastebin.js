import axios from "axios"

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

    // const CORSProxyURL = "https://cors-anywhere.herokuapp.com/"
    const CORSProxyURL = "https://mmf-cors-proxy.noah-nuebling.workers.dev/?"

    // Pastebin api didn't work for some reason.
    // I'm always getting the error: "Bad API request, invalid api_dev_key"

    // console.log("Getting pastebin...")
    //
    // const apiKey = "rC1P3TfFhNgvpNoIWh5uEli0diQEh4m9"
    //
    // const response = await axios.post(CORSProxyURL + "https://pastebin.com/api/api_post.php", {
    //         "api_dev_key": apiKey,
    //         "api_option": 'paste',
    //         "api_paste_code": body
    // })
    // console.log(response)

    // console.log("Getting hastebin...")
    // Hastebin is incredibly slow sometimes (rn takes like 30 seconds to respond with a 503) - might be overloaded

    const baseURL = "https://hastebin.com/documents/"
    const response = await axios.post(CORSProxyURL + baseURL, body)
    console.log("Server response:", response)
    return baseURL + response.data.key

    // Creating ghostbin

    // const baseURL = "https://ghostbin.com/paste/new"
    // const response = await axios.post(CORSProxyURL + baseURL, {
    //     form: {
    //         text: "test post"
    //     },
    //     headers: {
    //         'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    //     }
    // })
    // console.log("Server response:", response)

    // Requesting httpbin for testing


}