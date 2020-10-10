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

// 快速排序
let fastSort = function fastSort(arr, num) {
    console.log("快速排序");
    let sort = function (arr, left, right) {
        let l, r;//左下标，右下标
        if (left !== undefined) {
            l = left;
        }
        if (right !== undefined) {
            r = right;
        }
        // let pivot=arr[Math.floor((right-left)/2)];//中轴
        let pivot = arr[right];//中轴
        let temp = 0;//临时变量，交换时用
        //while目的是让笔pivot值小的放左边，比pivot大的放右边
        if (num > 0) {
            while (l < r) {
                //在pivot一直找，找到大于等于pivot的值
                while (arr[l] > pivot) {
                    l++;
                }
                //在pivot一直找，找到小于等于pivot的值
                while (arr[r] < pivot) {
                    r--;
                }
                if (l >= r) {
                    break;
                }
                // console.log("l: "+l+" r: "+r+" arr[l]: "+arr[l]+" arr[r]: "+arr[r])
                // console.log("交换前",arr)
                // 交换
                // 如果l>=r , 说明pivot左边的值已经按照左边小于pivot的值，右边大于pivot的值
                // if(i>=r){break;}
                temp = arr[l];
                arr[l] = arr[r];
                arr[r] = temp;
                // console.log("交换后",arr)
                //如果交换完后，发现这个arr[l]==pivot值，r-- 向前移动
                if (arr[l] == pivot) {
                    r--;
                }
                //如果交换完后，发现这个arr[r]==pivot值，l++ 向前移动
                if (arr[r] == pivot) {
                    l++;
                }

            }
        } else if (num < 0) {
            while (l < r) {
                //在pivot一直找，找到大于等于pivot的值
                while (arr[l] < pivot) {
                    l++;
                }
                //在pivot一直找，找到小于等于pivot的值
                while (arr[r] > pivot) {
                    r--;
                }
                if (l >= r) {
                    break;
                }
                // console.log("l: "+l+" r: "+r+" arr[l]: "+arr[l]+" arr[r]: "+arr[r])
                // console.log("交换前",arr)
                // 交换
                // 如果l>=r , 说明pivot左边的值已经按照左边小于pivot的值，右边大于pivot的值
                // if(i>=r){break;}
                temp = arr[l];
                arr[l] = arr[r];
                arr[r] = temp;
                // console.log("交换后",arr)
                //如果交换完后，发现这个arr[l]==pivot值，r-- 向前移动
                if (arr[l] == pivot) {
                    r--;
                }
                //如果交换完后，发现这个arr[r]==pivot值，l++ 向前移动
                if (arr[r] == pivot) {
                    l++;
                }

            }
        }
        // 如果l==r,必须l++,r--,否则会出现栈溢出
        if (arr[l] == arr[r]) {
            // console.log("l==r -- l: "+l+" r: "+r+" arr[l]: "+arr[l]+" arr[r]: "+arr[r])
            l++;
            r--;
        }

        //向左递归
        if (left < r) {
            // console.log("向左递归 -",left,"-",r,"-",arr)
            // console.log("向左递归 -",left,"-",r)
            // console.log(arr)
            sort(arr, left, r);
        }
        //向右递归
        if (right > l) {
            // console.log("向右递归 -",l,"-",right,"-",arr)
            // console.log("向右递归 -",l,"-",right)
            // console.log(arr)
            sort(arr, l, right);
        }
        // console.log("程序结束"+arr)
    };
    arr = sort(arr, 0, arr.length - 1);
    return arr;
};

// 归并排序
let mergeSort = function (arr, num) {
    console.log("归并排序");
    //分+合
    let mergeSort = function (arr, left, right, temp) {
        if (left < right) {
            let mid = Math.floor((left + right) / 2);//中间索引
            mergeSort(arr, left, mid, temp);
            mergeSort(arr, mid + 1, right, temp);
            merge(arr, left, mid, right, temp);
        }
    };

    /**
     * @param arr 原始数组
     * @param left 左边有序序列的初始索引
     * @param mid 中间
     * @param right 右边
     * @param temp 中转数组
     */
    let merge = function (arr, left, mid, right, temp) {
        let i = left;//初始化i 左边有序序列的初始索引
        let j = mid + 1;//右边的初始索引
        let t = 0;//指向temp数组的当前索引
        //先把左右两边的数据按照规则填充到temp数组
        //知道左右两边的有序序列有一边处理完毕位置
        while (i <= mid && j <= right) {//继续
            //如果左边的有序序列的当前元素，小于等于右边的当前元素
            //即将左边的当前元素拷贝到temp数组
            //然后t++,i++
            if (arr[i] <= arr[j]) {
                temp[t] = arr[i];
                t++;
                i++;
            } else {// 反之 ，将右边有序序列的当前元素，拷贝到temp数组
                temp[t] = arr[j];
                t++;
                j++;
            }
        }
        //把有剩余数据的一边的数据依次全部填充到temp
        while (i <= mid) {//左边的有序序列有剩余元素，j就全部填充到temp
            temp[t] = arr[i];
            t++;
            i++;
        }
        while (j <= right) {//右边有剩余
            temp[t] = arr[j];
            t++;
            j++;
        }
        //将temp数组元素重新copy到arr
        //注意，并不是每次都拷贝所有
        t = 0;
        let tempLeft = left;
        while (tempLeft <= right) {
            //第一次合并，tempLeft=0,right=1
            //第二次tempLeft=2,right=3
            //第三次tempLeft=0,right=3
            //最后一次tempLeft=0,right=length-1
            arr[tempLeft] = temp[t];
            t++;
            tempLeft++;
        }
    };
    let temp = new Array(arr.length);
    mergeSort(arr, 0, arr.length - 1, temp);
};

//基数排序
let radixSort = function (arr, num){
    console.log("基数排序")
    //定义一个二维数组，表示十个桶，每个桶是个一维数组
    //1.二维数组包含10个一维数组
    //2.为了防止放入数的时候，s数据溢出，每个数组大小定义为arr.length（JAVA）(由于现在是js代码，则不需要考虑长度问题)
    //3.很明确，基数排序是使用空间换时间的经典算法
    let bucket = new Array(10);

}

let list = [];
let num = 10;
num = 100000;
let start, end;
console.log("开始生成随机数组: " + new Date().getTime());
for (let i = 0; i < num; i++) {
    list.push(Math.floor(Math.random() * (num * 10)));
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
// runFunction(sellSortTwo, Array.from(list), 1);
// //快速排序
// runFunction(fastSort, list, 1);
// runFunction(fastSort, Array.from(list), 1);
//归并排序
runFunction(mergeSort, list, 1);

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