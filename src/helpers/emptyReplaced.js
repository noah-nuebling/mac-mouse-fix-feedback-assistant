export function emptyReplaced (strings, replacement) {

    var out = {}

    for (let key in strings) {
        if (strings.hasOwnProperty(key)) {
            let s = strings[key]
            if (typeof s === "string"
                && s === "") {
                out[key] = replacement
            } else {
                out[key] = s
            }
        }
    }

    return out
}