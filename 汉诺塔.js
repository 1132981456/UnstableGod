// 汉诺塔，分治算法
// 汉诺塔:汉诺塔(又称河内塔)问题是源于印度一个古老传说的益智玩具。
// 大梵天创造世界的时候做了三根金刚石柱子,在一根柱子上从下往上按照大小顺序摞着64片黄金圆盘。
// 大梵天命令婆罗门把圆盘从下面开始按大小顺序重新摆放在另一根柱子上。
// 并且规定,在小圆盘上不能放大圆盘,在三根柱子之间一次只能移动一个圆盘。


//汉诺塔的移动方法
function hanoiTower (num ,a,b,c){
    //如果只有一个盘
    if(num==1){
        console.log("第",1,"个盘从 ",a," -> ",c)
    }else{
        //如果有n>=2的情况，我们总是可以看作是两个盘 1.最下面的盘 2.上面所有的盘
        //1. 先把最上面的所有盘A->B,移动过程中会使用到C
        hanoiTower(num-1,a,c,b)
        //2. 把最下边的盘A->C
        console.log("第",num,"个盘从 ",a," -> ",c)
        //3. 把B塔的所有盘从B->C,移动过程中使用到A
        hanoiTower(num-1,b,a,c)
    }
}

let start = new Date().getTime();
hanoiTower(30,"A","B","C")
let end = new Date().getTime();
console.log("汉诺塔移动完毕，耗时: " + (end - start) / 1000 + " 秒");
