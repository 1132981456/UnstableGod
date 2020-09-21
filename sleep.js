//定时任务
function sleep(time) {
    return new Promise(resolve =>
        setTimeout(resolve, time)
    );
}
async function output() {
    console.log("sleep")
    let out = await sleep(2000);
    console.log(new Date())
    return out;
}
console.log(new Date())
let aaa = output();