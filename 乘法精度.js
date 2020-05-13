/**
 * 由于计算机由 1,0 翻译导致计算机出现精度的问题
 * 目前以下方法可以解决该精度问题
 * @param num
 * @param decimal
 */

function mathRound(num, decimal) {
    if (isNaN(num)) {
        return 0;
    }
    const p1 = Math.pow(10, decimal + 1);
    const p2 = Math.pow(10, decimal);
    return Math.round(num * p1 / 10) / p2;
}
function MathToFixed(num, decimal) {
    return mathRound(num, decimal).toFixed(decimal);
}
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{
        m+=s1.split(".")[1].length
    }catch(e){
        throw e
    }
    try{
        m+=s2.split(".")[1].length
    }catch(e){
        throw e
    }
    return Number(s1.replace(".",""))*Number(s2.replace(".","")) / Math.pow(10,m)
}

//示例
let num1=0.85,num2=0.009;
console.log(parseFloat(MathToFixed(accMul(num1,num2),2)));
