/**
 * 冒泡排序
 * @param arr 数组
 * @param num 大于 0 由大到小 ， 小于 0 由小到大
 * @returns {*} 排序后数组
 */
let bubbleSort = function bubbleSort(arr, num) {
    /**
     * 冒泡排序(Bubble Sorting)的基本思想
     * 通过对待排序序列从前向后(从下标较小的元素开始),依次比较相邻元素的值,
     * 若发现逆序则交换,使值较大的元素逐渐从前移向后部,就象水底下的气泡一样逐渐向上冒。
     *
     * 优化
     * 因为排序的过程中,各元素不断接近自己的位置,如果一趟比较下来没有进行过交换,
     * 就说明序列有序,因此要在排序过程中设置个标志flag判断元素是否进行过交换。从而减少不必要的比较
     *
     * 小结冒泡排序规则
     * (1)一共进行数组的大小1次大的循环
     * (2)每一趟排序的次数在逐渐的属少
     * (3)如果我们发现在某趟排序中,没有发生一次交换,可以提前结束冒泡排序。这个就是优化
     */
    console.log("冒泡排序");
    if (num > 0) {
        let max = arr.length;
        let temp;//临时变量
        while (max > 0) {
            let flag = true;
            for (let i = 0; i < max - 1; i++) {
                if (arr[i] < arr[i + 1]) {
                    temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    flag = false;
                }
            }
            max--;
            if (flag) {
                break;
            }
        }
    } else if (num < 0) {
        let max = arr.length;
        let temp;
        while (max > 0) {
            let flag = true;
            for (let i = 0; i < max - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    flag = false;
                }
            }
            max--;
            if (flag) {
                break;
            }
        }
    }
    return arr;
};

/**
 * 选择排序
 * @param arr 数组
 * @param num 大于 0 由大到小 ， 小于 0 由小到大
 * @returns {*} 排序后数组
 */
let selectSort = function selectSort(arr, num) {
    /**
     * 基本思想
     * 第一次从arr[0]~arr[n-1]中选最小值，与arr[0]交换，
     * 第二次从arr[1] arr[n-1]中选最小值, 与arr[1]交换，
     * 第三次从arr[2]~arr[n-1]中选取最小值，与arr[2]交换
     * 第n-1次从arr[n-2]~arr[n-1]中选取最小值，与arr[n-2]交换，总共通过n-1次，
     * 得到一个排序码从小到大排列的有序序列
     *
     * 说明
     * 1. 选择排序一共有数组大小-1轮排序
     * 2. 每一轮爱旭，又是一个循环，循环的规则(代码)
     * 2.1先假定当前这个数是最小数
     * 2.2然后和后面的每个数进行比较,如果发现有比当前数更小的数,就重新确定最小数，并得到下标
     * 2.3当遍历到数组的最后时,就得到本轮最小数和下标
     * 2.4交换(代码)
     */
    console.log("选择排序");
    if (num > 0) {
        for (let i = 0; i < arr.length - 1; i++) {
            let maxIndex = i;
            let max = arr[i];
            for (let j = i + 1; j < arr.length; j++) {
                if (max < arr[j]) {//说明假定的最大值不是最大的
                    max = arr[j];//重置min
                    maxIndex = j;//重置minIndex
                }
            }
            if (maxIndex != i) {
                arr[maxIndex] = arr[i];
                arr[i] = max;
            }
        }
    } else if (num < 0) {
        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            let min = arr[i];
            for (let j = i; j < arr.length; j++) {
                if (min > arr[j]) {//说明假定的最小值不是最小的
                    min = arr[j];//重置min
                    minIndex = j;//重置minIndex
                }
            }
            if (minIndex != i) {
                arr[minIndex] = arr[i];
                arr[i] = min;
            }
        }
    }


    return arr;
};

/**
 * 插入排序
 * 当插入的数是较小数时，后移的次数明显增多，对效率有影响
 * 如[2,3,4,5,6,1]
 * @param arr 数组
 * @param num 大于 0 由大到小 ， 小于 0 由小到大
 * @returns {*} 排序后数组
 */
let insertSort = function insertSort(arr, num) {
    console.log("插入排序");
    if (num > 0) {
        for (let i = 1; i < arr.length; i++) {
            //定义待插入数
            let insertVal = arr[i];
            let insertIndex = i - 1;//arr[1]的前面一个数的下标

            //给insertValue找到插入的位置
            //说明
            //1. insertIndex>=0 保证在给 insertVal 找插入位置，不越界
            //2. insertVal<arr[insertIndex] 待插入的数，还没有找到插入位置
            //3. 就需要将 arr[insertIndex]后移

            while (insertIndex >= 0 && insertVal > arr[insertIndex]) {
                arr[insertIndex + 1] = arr[insertIndex];
                insertIndex--;
            }
            //当退出while时，说明插入的位置找到，insertIndex+1
            arr[insertIndex + 1] = insertVal;
        }
    } else if (num < 0) {
        for (let i = 1; i < arr.length; i++) {
            //定义待插入数
            let insertVal = arr[i];
            let insertIndex = i - 1;//arr[1]的前面一个数的下标

            //给insertValue找到插入的位置
            //说明
            //1. insertIndex>=0 保证在给 insertVal 找插入位置，不越界
            //2. insertVal<arr[insertIndex] 待插入的数，还没有找到插入位置
            //3. 就需要将 arr[insertIndex]后移

            while (insertIndex >= 0 && insertVal < arr[insertIndex]) {
                arr[insertIndex + 1] = arr[insertIndex];
                insertIndex--;
            }
            //当退出while时，说明插入的位置找到，insertIndex+1
            arr[insertIndex + 1] = insertVal;
        }
    }


    return arr;
};

/**
 * 希尔排序(缩小增量排序)
 * 基本思想
 * 希尔排序是把记录按下标的一定增量分组,对每组使用直接插入排序算法排序随着增量逐渐减少,
 * 每组包含的关键词越来越多,当增量减至1时,整个文件恰被分成一组,算法便终止
 * @param arr 数组
 * @param num 大于 0 由大到小 ， 小于 0 由小到大
 * @returns {*} 排序后数组
 */
let sellSortOne = function sellSortOne(arr, num) {
    //希尔排序交换法
    console.log("希尔排序-交换法");
    let temp = 0;
    if (num > 0) {
        //经过测试 将除以2改成除以3会变快 改成除以4相对除以3则变化不大
        for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // console.log('gap: '+gap)
            for (let i = gap; i < arr.length; i++) {
                for (let j = i - gap; j >= 0; j -= gap) {
                    if (arr[j] < arr[j + gap]) {
                        temp = arr[j];
                        arr[j] = arr[j + gap];
                        arr[j + gap] = temp;
                    }
                }
            }
        }
    } else if (num < 0) {
        //经过测试 将除以2改成除以3会变快 改成除以4相对除以3则变化不大
        for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // console.log('gap: '+gap)
            for (let i = gap; i < arr.length; i++) {
                for (let j = i - gap; j >= 0; j -= gap) {
                    if (arr[j] > arr[j + gap]) {
                        temp = arr[j];
                        arr[j] = arr[j + gap];
                        arr[j + gap] = temp;
                    }
                }
            }
        }
    }
    return arr;
};

// 希尔排序移位法
let sellSortTwo = function sellSortTwo(arr, num) {
    //希尔排序交换法
    console.log("希尔排序-移位法");
    let temp = 0;
    if (num > 0) {
        //增量gep 并逐步缩小容量
        for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            //从第gep个元素，逐个对其所在的组进行排序
            for (let i = gap; i < arr.length; i++) {
                let j = i;
                temp = arr[j];
                while (j - gap >= 0 && temp > arr[j - gap]) {
                    arr[j] = arr[j - gap];
                    arr[j - gap] = temp;
                }
            }
        }
    } else if (num < 0) {
        //增量gep 并逐步缩小容量
        for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            //从第gep个元素，逐个对其所在的组进行排序
            for (let i = gap; i < arr.length; i++) {
                let j = i;
                temp = arr[j];
                while (j - gap >= 0 && temp < arr[j - gap]) {
                    arr[j] = arr[j - gap];
                    arr[j - gap] = temp;
                }
            }
        }
    }
};


let list = [];
// let num = 10;
let num = 10000000;
let start, end;
console.log("开始生成随机数组: " + new Date().getTime());
for (let i = 0; i < num; i++) {
    list.push(Math.floor(Math.random() * num));
}
console.log("随机数组生成完毕: " + new Date().getTime());
console.log("随机数组长度: " + list.length);

// console.log(list);
// runFunction(insertSort,list,1)

//冒泡排序
// runFunction(bubbleSort, list, 1);
// runFunction(bubbleSort, Array.from(list), 1);
// //选择排序
// runFunction(selectSort,list,1)
// runFunction(selectSort, Array.from(list), 1);
// //插入排序
// runFunction(insertSort,list,1)
// runFunction(insertSort, Array.from(list), 1);
// //希尔排序
// runFunction(sellSortOne,list,1)
// runFunction(sellSortOne, Array.from(list), 1);
// runFunction(sellSortTwo, list, 1);
runFunction(sellSortTwo, Array.from(list), 1);

// console.log(list);


/**
 * 执行排序方法
 * @param functionName 排序的方法
 * @param list 数组
 * @param num 大于 0 由大到小 ， 小于 0 由小到大
 */
function runFunction(functionName, list, num) {
    start = new Date().getTime();
    // console.log("开始排序: "+start);
    //Array.from() 防止同时测试时，上一条将数组排序后下一条测试时使用的是已排序的数组
    functionName(list, num);
    end = new Date().getTime();
    // console.log("排序结束: "+end);
    // console.log("排序耗时: "+(end-start)+" 毫秒")
    console.log("排序耗时: " + (end - start) / 1000 + " 秒");
}