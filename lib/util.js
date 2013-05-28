
var crypto = require('crypto');

exports.md5 = function(s) {
	var md5 = crypto.createHash('md5');
	md5.update(s, 'utf8');
	return md5.digest('hex');
};

exports.dateformat = function(dt) {
    if (! dt || ! dt.getYear) {
        return "";
    }
    var y = dt.getYear() + 1900;
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    var H = dt.getHours();
    var M = dt.getMinutes();
    var S = dt.getSeconds();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    if (H < 10) H = "0" + H;
    if (M < 10) M = "0" + M;
    if (S < 10) S = "0" + S;

    return (y + '/' + m + '/' + d + " " + H + ":" + M + ":" + S);
}


