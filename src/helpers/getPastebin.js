import axios from "axios"

// Upload arg string to pastebin and return url
export async function getPastebin(body) {

    // Pastebin api didn't work for some reason.
    // I'm always getting the error: "Bad API request, invalid api_dev_key"

    // console.log("Getting pastebin...")
    //
    // const apiKey = "rC1P3TfFhNgvpNoIWh5uEli0diQEh4m9"
    //
    // axios.post("https://pastebin.com/api/api_post.php", {
    //         "api_dev_key": apiKey,
    //         "api_option": 'paste',
    //         "api_paste_code": body
    // }).then(response => {
    //     console.log(response)
    // })


    console.log("Getting hastebin...")

    const baseURL = "https://hastebin.com/"
    const response = await axios.post(baseURL + "documents", body)
    return baseURL + response.data.key
}