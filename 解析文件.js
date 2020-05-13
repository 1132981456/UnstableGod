const fs = require('fs');
const iconv = require('iconv-lite');
const tool = require('../utils/tool');
const getGuid = require('uuid/v4');
const getTimeString = require('../utils/getTimeString.js');
const getTimeNow = require('moment');
const bdCashSettlement = require('../models/bdCashSettlement.js');
const cashShortOver = require('../models/cashShortOver.js');
const bdStoreBank = require('../models/bdStoreBank.js');
const bdAccount = require('../models/bdAccount.js');
const bdStore = require('../models/bdStore.js');
const sysErrLog = require('../models/sysErrLog');
const dbSequelize = require('../utils/mssql')
const _ = require('lodash')


class HEXSmallAmount{
    constructor() { }
    async startParseHEXFile(req,res){
        try{
            //任务监控
            let logerr22=    await     sysErrLog.create({
                logErrBackId:getGuid(),
                addTime:getTimeString(),
                // startTime:getTimeString(),
                interfaceName:"解析HEX文件",
                result:"执行中",
                status:"-1",
                sysUserId:"system",
                errType:"insert",
            });
            // console.log(JSON.stringify(req.boday));
            let oldPath,newPath;
            let dirPath;
            if(req)dirPath=req.body.dirPath;
            if(!dirPath)dirPath="/data/HEX-EC";
            // if(dirPath)dirPath="/data/HEX-EC/test";
            if(!dirPath)dirPath="C:\\Users\\lgong\\Desktop\\hex";
            let backupsPath=dirPath+"/backups";
            console.log('开始执行HEX文件解析程序,路径: '+dirPath+'');

            //检查备份文件夹，不存在则创建
            if(!tool.tools.fsExistsSync(backupsPath)){
                tool.tools.mkdirs(backupsPath)
            }
            //获取文件夹内的文件，遍历
            let files = fs.readdirSync(dirPath);
            let backupFiles = fs.readdirSync(backupsPath);
            for(let i in files){
                //先判断是否重复的文件,非重复文件再读入数据
                let flag=true;
                for(let j in backupFiles){
                    if(files[i]==backupFiles[j]){
                        flag=false;
                        break;
                    }
                }
                //判断是否为文件
                oldPath=dirPath+"/"+files[i];
                if(fs.statSync(oldPath).isFile()&&flag){
                    try{
                        console.log("开始处理: "+oldPath)
                        //对文件进行处理
                        await this.parseSmallAmountFile(oldPath);
                        //移入备份文件夹
                        newPath=backupsPath+"/"+files[i];
                        fs.renameSync(oldPath,newPath);
                        console.log(oldPath+' 处理完毕且已备份至备份文件夹')
                    }catch (e) {
                        //写入报错信息
                        let endLog=    await     logerr22.update({
                            endTime:getTimeString(),
                            result:"读取文件'"+files[i]+"'时发生异常，错误信息: "+e,
                            status:"2"
                        });
                        throw e;
                    }
                }
            }
            let endLog=    await     logerr22.update({
                endTime:getTimeString(),
                // startTime:getTimeString(),
                // interfaceName:"二次账单文件解析",
                result:"解析HEX文件完成",
                status:"-1",
                sysUserId:'system'
            });
            console.log('HEX文件解析程序执行完成,路径: '+dirPath+'');
        }catch (e) {
            console.log(e);
            return;
        }
    }

    async parseSmallAmountFile(filePath){
        let where={},wherex='',tomorrowWhere={};//条件
        let returnData=[],returnSmallAmount;//返回的数据
        let insertData={};//插入的数据
        let a=0,b=0,tomorrow,tenDaysAgo,yesterday,day;
        //更新数据失败的门店号集合
        let errorStore=new Set();
        //更新明日的前日小额暂存款失败的门店号集合
        let tomorrowErrorStore=new Set();
        let aa=0,bb=0;
        let mssql=[],sql;
        let s='';
        let nowStoreIdMap;//当前门店的主键信息

        let trans = await dbSequelize.transaction();

        //获取文件内容+排序
        let table = smallAmountParsingTXT(filePath);
        // _.sortBy(table,function(iteam){return iteam[1].substring(8,2)});
        table = table.sort((a,b)=>{return new Date(a[1])-new Date(b[1])})


        //遍历去重+排序
        let storeSet = new Set();
        for(let i=0;i<table.length;i++){storeSet.add(table[i][1].substr(0,10)+","+table[i][0]);}
        storeSet=Array.from(storeSet);
        _.sortBy(storeSet,function(iteam){return storeSet})

        let oldDay='2060-01-01',newDay='1970-01-01';
        //循環查找最早和最新的一天
        for(let i=0;i<table.length;i++){
            if(oldDay>table[i][1].substr(0,10)){oldDay=table[i][1].substr(0,10)}
            if(newDay<table[i][1].substr(0,10)){newDay=table[i][1].substr(0,10)}
        }

        //获取最早到最新时间内的数据
        let newOldWithinTime = `select today_time todayTime,store_no storeNo from bd_cash_settlement with(nolock)
                where today_time between '${oldDay}' and '${newDay}' order by todayTime desc,storeNo `;
        // console.log(newOldWithinTime)
        newOldWithinTime = await dbSequelize.query(newOldWithinTime, {
            type: dbSequelize.QueryTypes.SELECT,
            raw: true
        });
        console.log("获取了 "+oldDay+" - "+newDay+" 内的数据，数量:"+newOldWithinTime.length)

        //查询门店法人信息并塞入map
        let store = `select store_no storeNo, le_no leNo from bd_store`;
        store = await dbSequelize.query(store, {
            type: dbSequelize.QueryTypes.SELECT,
            raw: true
        });
        let storeMap = new Map();
        for(let i=0;i<store.length;i++){
            storeMap.set(store[i].storeNo,store[i].leNo)
        }

        //循环检查门店和日期，数据库中是否存在
        for(let element of storeSet) {
            let data = element.split(",");
            let storeNo = data[1];
            let time = data[0];
            let index = _.findIndex(newOldWithinTime, {todayTime:time,storeNo:storeNo});
            if(index==-1){
                sql=`INSERT INTO 
                 [bd_cash_settlement]
                 ([cash_check_id], [le_no], [store_no], [yesterday_cash_balance], [our_cash_amount], [bank_cash_amount], [samll_staging_amount], [today_cash_amount], [today_time], [add_time], [yesterday_small_amount], [reconciliation_status], [fco_id], [is_deal_with], [counterfeit_banknote], [cash_over], [cash_short]) 
                 VALUES 
                 ('${getGuid()}', '${storeMap.get(storeNo)}', '${storeNo}', 0, 0, 0, 0, 0, '${time}', '${getTimeString()}', 0, '0', NULL, 'N', 0, 0, 0);`;
                // console.log(sql);
                mssql.push(
                    dbSequelize.query(sql, {
                        type: dbSequelize.QueryTypes.INSERT,
                        transaction: trans
                    })
                );
            }
        }

        console.log("开始占坑：" + getTimeString() + " 數量: " + mssql.length);
        returnData=await Promise.all(mssql);
        await trans.commit();
        mssql=[];
        trans=await dbSequelize.transaction();
        console.log("占坑结束：" + getTimeString());
        let cc=0;
        returnData.forEach(iteam=>{
            if(iteam[1]!=1){cc++}
        })
        if(cc>0){throw "HEX占坑失败,数量: "+cc}

        //读取的文件内日期的集合，之后计算前日小额用
        let timeList = new Set();

        console.log("开始读入HEX文件");
        for(let i=0;i<table.length;i++) {
            // if(i%5000==0){console.log("已解析:"+i)}
            //檢查時間，不對就重新按時間取一遍數據
            if(table[i][1].substr(0,10)!=day){
                timeList.add(table[i][1]);//将日期塞入map中备用
                console.log("开始更新 "+day+" 小额数据：" + getTimeString() + " " + mssql.length);
                //先將數據更新入數據庫
                returnData=await Promise.all(mssql);
                await trans.commit();
                mssql=[];
                trans=await dbSequelize.transaction();
                console.log(getTimeString() + "小額已更新: "+i);
                //记录更新失败的数量
                returnData.forEach(iteam=>{if(iteam[1]==0){ aa++ }});

                //獲取今天之前的所有数据
                day=table[i][1].substr(0,10);
                // console.log('day: '+day)

                //获取当前日期所有门店的主键
                s = `select cash_check_id cashCheckId,store_no storeNo from bd_cash_settlement where today_time='${day}'`;
                let nowStoreId = await dbSequelize.query(s, {
                    type: dbSequelize.QueryTypes.SELECT,
                    raw: true
                });
                nowStoreIdMap=new Map();
                nowStoreId.forEach(iteam=>{
                    nowStoreIdMap.set(iteam.storeNo,iteam.cashCheckId);
                })

            }
            //分析当前是什么数据，生成sql加入队列
            if (table[i][3] === '本日累计小额暂存款') {
                // console.log("这是本日累计小额暂存款");
                // sql=`update bd_cash_settlement set samll_staging_amount=${table[i][4] === undefined ? 0 : table[i][4]},yesterday_small_amount=${returnData.smallStagingAmount}  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                sql=`update bd_cash_settlement set samll_staging_amount=${(!table[i][4]||table[i][4]=='') ? 0 : table[i][4]} where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
            } else if (table[i][3] === '伪钞') {
                // console.log("这是伪钞");
                // sql=`update bd_cash_settlement set counterfeit_banknote=${table[i][4] === undefined ? 0 : table[i][4]}  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                sql=`update bd_cash_settlement set counterfeit_banknote=${(!table[i][4]||table[i][4]=='') ? 0 : table[i][4]}  where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
            } else if (table[i][3] === '门市现金短溢') {
                // console.log("这是门市现金短溢");
                let cashShortOver = (!table[i][4]||table[i][4]=='') ? 0 : table[i][4];
                if(cashShortOver==0){
                    //长短款为0，直接过
                    // sql=`update bd_cash_settlement set cash_short=0,cash_over=0  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                    sql=`update bd_cash_settlement set cash_short=0,cash_over=0  where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
                }else if(cashShortOver>0) {
                    //长款
                    // sql = `update bd_cash_settlement set cash_short=0,cash_over=${cashShortOver}  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                    sql = `update bd_cash_settlement set cash_short=0,cash_over=${cashShortOver}  where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
                }else if(cashShortOver<0){
                    //短款
                    // sql=`update bd_cash_settlement set cash_short=${cashShortOver*-1},cash_over=0  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                    sql=`update bd_cash_settlement set cash_short=${cashShortOver*-1},cash_over=0  where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
                }
            } else if (table[i][3] === '发生额') {
                // console.log("这是伪钞");
                // sql=`update bd_cash_settlement set our_cash_amount=${table[i][4] === undefined ? 0 : table[i][4]}  where store_no=${table[i][0]} and today_time='${table[i][1]}'; `
                sql=`update bd_cash_settlement set our_cash_amount=${(!table[i][4]||table[i][4]=='') ? 0 : table[i][4]}  where cash_check_id='${nowStoreIdMap.get(table[i][0])}'; `
            }
            // console.log(sql)
            mssql.push(
                dbSequelize.query(sql, {
                    type: dbSequelize.QueryTypes.UPDATE,
                    transaction: trans
                })
            );
        }

        console.log("开始更新小额数据：" + getTimeString() + " 數量: " + mssql.length);
        returnData=await Promise.all(mssql);
        await trans.commit();
        mssql=[];
        trans=await dbSequelize.transaction();
        console.log("小额更新结束：" + getTimeString() + " " + mssql.length);
        //记录更新失败的数量
        returnData.forEach(iteam=>{if(iteam[1]==0){ aa++ }});

        console.log("开始获取前日小额数据")
        for(let x of timeList){
            //獲取今天之前的所有数据
            // console.log('x: '+x)
            let s = `SELECT a.today_time todayTime,a.store_no storeNo,samll_staging_amount smallStagingAmount 
                    FROM bd_cash_settlement a, 
                    (SELECT store_no, MAX (today_time) today_time FROM bd_cash_settlement WHERE today_time < '${x}' and le_no='744' GROUP BY store_no) b 
                    WHERE a.today_time = b.today_time AND a.store_no = b.store_no AND a.today_time < '${x}' and le_no='744'
                    ORDER BY a.store_no `;
            returnSmallAmount = await dbSequelize.query(s, {
                type: dbSequelize.QueryTypes.SELECT,
                raw: true
            });
            console.log("獲取了 "+x+" 以前的數據:"+returnSmallAmount.length);

            //获取当前日期所有门店的主键
            s = `select cash_check_id cashCheckId,store_no storeNo from bd_cash_settlement where today_time='${x}' and le_no='744' `;
            let nowStoreId = await dbSequelize.query(s, {
                type: dbSequelize.QueryTypes.SELECT,
                raw: true
            });

            //循环获取前日小额并生成更新语句
            for(let y of nowStoreId){
                returnData=0;//初始化值为0
                for(let j=0;j<returnSmallAmount.length;j++){
                    if(returnSmallAmount[j].storeNo==y.storeNo){returnData=returnSmallAmount[j].smallStagingAmount;break;}
                }
                sql=`update bd_cash_settlement set yesterday_small_amount=${returnData} where cash_check_id='${y.cashCheckId}'; `
                mssql.push(
                    dbSequelize.query(sql, {
                        type: dbSequelize.QueryTypes.UPDATE,
                        transaction: trans
                    })
                );
            }

            console.log("开始更新 "+x+" 前日小额：" + getTimeString() + " " + mssql.length)
            //更新原始账单状态
            returnData = await Promise.all(mssql);
            await trans.commit();
            trans=await dbSequelize.transaction();
            console.log("前日小额更新结束：" + getTimeString() + " " + mssql.length);
            //记录更新失败的数量
            returnData.forEach(iteam=>{if(iteam[1]==0){ bb++ }});

            for(let y of nowStoreId){
                sql=`update bd_cash_settlement set our_cash_amount=(yesterday_small_amount + today_cash_amount - counterfeit_banknote - samll_staging_amount + cash_over - cash_short)  where cash_check_id='${y.cashCheckId}'; `
                mssql.push(
                    dbSequelize.query(sql, {
                        type: dbSequelize.QueryTypes.UPDATE,
                        transaction: trans
                    })
                );
            }

            console.log("开始更新 "+x+" 应缴款数据：" + getTimeString() + " " + mssql.length)
            //更新原始账单状态
            returnData = await Promise.all(mssql);
            await trans.commit();
            trans=await dbSequelize.transaction();
            console.log("应缴款更新结束：" + getTimeString() + " " + mssql.length);
            //记录更新失败的数量
            returnData.forEach(iteam=>{if(iteam[1]==0){ bb++ }});
        }

        // console.log("开始计算当日应交款...........................");

        // let num=0;
        // day='';
        // //遍历集合开始计算
        // // for(let element of storeSet) {
        // for(let i=0;i<storeSet.length;i++) {
        //     let element=storeSet[i];
        //     let data=element.split(",");
        //     let storeNo=data[1];
        //     let time=data[0];
        //
        //     if(time!=day){
        //         console.log("开始更新应缴款：" + getTimeString() + " " + mssql.length);
        //         day=time;
        //         //先將數據更新入數據庫
        //         returnData=await Promise.all(mssql);
        //         await trans.commit();
        //         mssql=[];
        //         trans=await dbSequelize.transaction();
        //         console.log(getTimeString() + "应缴款已更新: "+num);
        //         //记录更新失败的数量
        //         returnData.forEach(iteam=>{if(iteam[1]==0){ aa++ }});
        //
        //         //获取当前日期所有门店的主键
        //         s = `select cash_check_id cashCheckId,store_no storeNo from bd_cash_settlement where today_time='${time}'`;
        //         let nowStoreId = await dbSequelize.query(s, {
        //             type: dbSequelize.QueryTypes.SELECT,
        //             raw: true
        //         });
        //         nowStoreIdMap=new Map();
        //         nowStoreId.forEach(iteam=>{
        //             nowStoreIdMap.set(iteam.storeNo,iteam.cashCheckId);
        //         })
        //
        //     }
        //
        //     //前日小额暂存 + 門店pos現金當日匯總金額 - 偽鈔 - 小額暫存 +\- HEX短溢 - NG POS Cash Short + NG POS Cash Over
        //     // sql=`update bd_cash_settlement set our_cash_amount=(yesterday_small_amount + today_cash_amount - counterfeit_banknote - samll_staging_amount + cash_over - cash_short) where store_no=${storeNo} and today_time='${time}' `
        //     sql=`update bd_cash_settlement set our_cash_amount=(yesterday_small_amount + today_cash_amount - counterfeit_banknote - samll_staging_amount + cash_over - cash_short) where cash_check_id='${nowStoreIdMap.get(storeNo)}' `;
        //     // console.log(sql);
        //     mssql.push(
        //         dbSequelize.query(sql, {
        //             type: dbSequelize.QueryTypes.UPDATE,
        //             transaction: trans
        //         })
        //     );
        //     num++;
        // }

        console.log("开始更新应缴款数据：" + getTimeString() + " " + mssql.length)
        //更新原始账单状态
        returnData = await Promise.all(mssql);
        await trans.commit();
        console.log("应缴款更新结束：" + getTimeString() + " " + mssql.length);
        //记录更新失败的数量
        returnData.forEach(iteam=>{if(iteam[1]==0){ bb++ }});

        // if(errorStore.size>0 || tomorrowErrorStore.size>0){
        if(aa>0 || bb>0){
            // throw "导入今日数据时 "+errorStore.size+" 家门店未找到, 导入明日的前日小额暂存时 "+tomorrowErrorStore.size+" 家门店未找到, 计算应收金额过程中失败 "+b+" 条. "
            throw "导入小额数据时，更新失败 "+aa+" 条，计算当日应缴款时，更新失败 "+bb+" 条"
            // + "今日导入失败的门店号:"+(errorStore.size>30?"{数量大于30，已省略}":errorStore.toString())
            // + " 明日导入失败的门店号: "+(tomorrowErrorStore.size>30?"{数量大于30，已省略}":JSON.Stringify(tomorrowErrorStore));
        }
        console.log("HEX文件解析以及計算应收款結束...");
        // throw 'stop!!!'
    }


}

function smallAmountParsingTXT(Pathname) {
    let data = fs.readFileSync(Pathname, { encoding: 'binary' });
    let str = iconv.decode(data, 'utf-8');
    let reg = new RegExp("\"","g");
    str = str.replace(reg,"");
    let table = [];
    let rows = str.split("\n");
    // console.log(rows[1].replace(reg,"").split(","));
    // i=1 跳过第一行
    for (let i = 1; i < rows.length; i++) {
        if (rows[i] !== '')
            table.push(rows[i].split(","))
    }
    return table
}

Date.prototype.Format = function (fmt) { // author: meizz
    let o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function create( str ){
    let path = [];
    let arr = str.split("/");
    let len = arr.length;
    for(let i=0; i<len; i++ ){
        path.push(arr[i]);
        let filename = path.join("/");
        // 判断这个文件或文件夹是否存在
        let bln = fs.existsSync(filename);
        if( bln == false ){
            if( i<len-1 ){  // 一定是文件夹
                // console.log( "计划创建 "+filename+" 文件夹" );
                fs.mkdirSync(filename);
            }else{
                // 判断是文件还是文件夹
                if( arr[i].indexOf(".") > -1 ){
                    // 如果是文件
                    // console.log( "创建文件"+filename );
                    fs.writeFileSync(filename);
                }else{
                    // 如果是文件夹
                    // console.log( "创建文件夹"+filename );
                    fs.mkdirSync(filename);
                }
            }
        }
    }
}

module.exports = new HEXSmallAmount();

// new HEXSmallAmount().startParseHEXFile()

// let str=''
// for(let i=0;i<5000;i++){
//     str+=getGuid()+','
// }
// console.log(str)