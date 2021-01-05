//在js已有的函数基础上添加新的自定义函数

//字符串替换所有字符
String.prototype.replaceAll = function (FindText, RepText) {
    let regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}
let str = '12345678987654321'
console.log(str)
console.log(str.replaceAll('1','2'))