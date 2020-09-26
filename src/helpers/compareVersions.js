
/*
* This doesn't work for versions that consist of anything more than x.x.x, so no x.x.xx and no x.x.x-Beta-x.
* Doing this right is not super trivial, so I'm using the semVer lib instead.
* */
export function compareVersions(a, b) {

    // Split into parts and reverse
    let aList = a.split(".").reverse()
    let bList = b.split(".").reverse()

    // Iterate over all parts and determine which is greater

    let out = 0 // -1 if a > b, 1 if a < b, 0 if equal
    let i = 0
    while (true) {

        let aOutOfBounds = i >= aList.length
        let bOutOfBounds = i >= bList.length

        if (aOutOfBounds || bOutOfBounds) { // Any of the 2 are out of bounds: we have our winner
            if (bOutOfBounds && !aOutOfBounds) { // Only b is out of bounds: a wins
                out = -1
            } else if (aOutOfBounds && !bOutOfBounds) { // Only a is out of bounds: b wins
                out = 1
            }
            // else: Both are out of bounds: we retain the winner from the last round

            return out
        }

        let aVal = aList[i]
        let bVal = bList[i]

        if (aVal > bVal) {
            out = -1
        } else if (aVal < bVal) {
            out = 1
        }
        // else: We retain our value from last round
    }

}