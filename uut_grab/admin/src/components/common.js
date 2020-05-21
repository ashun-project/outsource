var common = {
    formatDate: function(time, type) {
        var date = time ? new Date(time) : new Date();
        var str = '';
        var dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()];
        if (type > 0) {
            dateArr.push(' ');
            dateArr.push(date.getHours());
            dateArr.push(':');
            dateArr.push(date.getMinutes());
            if (type > 1) {
                dateArr.push(':');
                dateArr.push(date.getSeconds());
            }
        }
        dateArr.forEach(item => {
            if (typeof item === 'number' && item < 10) item = '0' + item;
            str += item;
        });
        return str;
    }
}

export default {
	common
}