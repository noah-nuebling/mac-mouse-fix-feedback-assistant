
export function autoHeight(elem) {

    console.log('AUTO HEIGHT TRIGGERED')

    elem.style.height = "1px";
    elem.style.height = (elem.scrollHeight)+"px";
}