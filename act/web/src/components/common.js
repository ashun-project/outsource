var common = {
    zodiacTxt: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    colorTxt:['red', 'blue', 'green'],
    zodiacData: [
        '01, 13, 25, 37, 49',
        '12, 24, 36, 48',
        '11, 23, 35, 47',
        '10, 22, 34, 46',
        '09, 21, 33, 45',
        '08, 20, 32, 44',
        '07, 19, 31, 43',
        '06, 18, 30, 42',
        '05, 17, 29, 41',
        '04, 16, 28, 40',
        '03, 15, 27, 39',
        '02, 14, 26, 38'
    ],
    colorData: [
        '01, 02, 07, 08, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46',
        '03, 04, 09, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42,47, 48',
        '05, 06, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49'
    ],
    addZero: function (i){
        return i < 10 ? "0" + i: i + "";
    },
    formatDate: function(dateP) {
        var time = dateP || new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        var w = time.getDay();
        var weekArr = ['日', '一', '二', '三', '四', '五', '六'];

        return {
            year: year,
            month: this.addZero(month),
            day: this.addZero(day),
            h: this.addZero(h),
            m: this.addZero(m),
            s: this.addZero(s),
            w: weekArr[w]
        }
    },
    // getEndDate(secondTime) {
    //     var date = secondTime ? new Date(secondTime) : new Date();
    //     return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " 21:35:00");
    // },
    getEndDate(secondTime) {
        var date = new Date();
        var et = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " 21:35:00");
        if (et.getTime() < date.getTime()) {
            return new Date(et.getTime() + (24 * 60 * 60 * 1000))
        } else {
            return et
        }
    },
    countDown: function(){
        var nowtime = new Date();
        var endtime = this.getEndDate();
        var hour = nowtime.getHours();
        var mut = nowtime.getMinutes();
        // if (hour >= 21 && mut >= 35) {
        //     endtime = this.getEndDate(nowtime.getTime() + (24 * 60 * 60 * 1000));
        // }
        // debugger
        
        var lefttime = parseInt((endtime.getTime() - nowtime.getTime() + 5000) / 1000);
        return {
            d: (this.addZero(parseInt(lefttime / (24*60*60))) + '').split(''),
            h: (this.addZero(parseInt(lefttime / (60 * 60) % 24)) + '').split(''),
            m: (this.addZero(parseInt(lefttime / 60 % 60)) + '').split(''),
            s: (this.addZero(parseInt(lefttime % 60)) + '').split('')
        }
    },
    getValue(codeNum, tyep) {
        var list = this[tyep + 'Data'];
        var idx = 0;
        for (var i = 0; i < list.length; i++) {
            var spt = list[i].replace(/\s+/g, '').split(',');
            var fil = spt.filter(item => item === codeNum);
            if (fil.length) {
                idx = i;
                break
            }
        }
        return this[tyep + 'Txt'][idx];
    },
    ballNum: function (codeList) {
        var arr = []
        for (var i = 0; i < codeList.length; i++) {
            var zodiac = this.getValue(codeList[i], 'zodiac');
            var color = this.getValue(codeList[i], 'color');
            arr.push({ball: codeList[i], zodiac: zodiac, color: color})
        }
        return arr;
    }
}

export default {
	common
}