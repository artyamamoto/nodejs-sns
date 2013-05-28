
function dateformat(dt) {
	if (! dt)
		return "";
	if (typeof dt == 'string') 
		return dt;
	if (! dt.getYear) {
		return "";
	}
	var y = dt.getYear() + 1900;
	var m = dt.getMonth() + 1;
	var d = dt.getDate();
	var H = dt.getHour();
	var M = dt.getMinute();
	var S = dt.getSecond();
	if (m < 10) m = "0" + m;
	if (d < 10) d = "0" + d;
	if (H < 10) H = "0" + H;
	if (M < 10) M = "0" + M;
	if (S < 10) S = "0" + S;
	
	return (y + '/' + m + '/' + d + " " + H + ":" + M + ":" + S);
}


function htmlescape(s) {
	var ar = {
		"<":"&lt;" , 
		">" :"&gt;", 
		"&" : "&amp;", 
		"\"":"&quot;", 
		"'" : "&#39;"};

	for (var k in ar) 
		s = s.split(k).join(ar[k]);
	return s;
}
jQuery(function($) {
	
});


