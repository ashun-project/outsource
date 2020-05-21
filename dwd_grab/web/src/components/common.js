// import axios from 'axios'
var common = {
    formatDate: function(time, ymd) {
        var date = time ? new Date(time) : new Date();
        var str = '';
        var dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate(), ' ', date.getHours(), ':', date.getMinutes()];
        if (ymd) {
            dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()];
        }
        dateArr.forEach(item => {
            if (typeof item === 'number' && item < 10) item = '0' + item;
            str += item;
        });
        return str;
    },
    // getCategories: function() {
    //     var list = []
    //     axios.post('/grab/cateforiesList', {}, {loading: true}).then(response => {
    //         list = response.list
    //         axios.post('/grab/queryUser', { id: id }).then(response => {})
    //     }).catch(() => {})
    // }
}


export default {
	common
}
