const week = {
	"0":"日",
	"1":"一",
	"2":"二",
	"3":"三",
	"4":"四",
	"5":"五",
	"6":"六"
};

const month_en = {
	1: "Jan",
	2: "Feb",
	3: "Mar",
	4: "Apr",
	5: "May",
	6: "Jun",
	7: "Jul",
	8: "Aug",
	9: "Sep",
	10: "Oct",
	11: "Nov",
	12: "Dec"
}

export function formatDate (date, options) {
	let {is_short, show_time} = options || {}
	const d = new Date(date)
	const weekday = week[d.getDay()]
	const day = d.getDate()
	const month = d.getMonth() + 1
	const year = d.getFullYear()
	const hour = d.getHours()
	const min = d.getMinutes()
	if (is_short) {
		// return `${month}月${day}日`
		return `${month_en[month]} ${day}`
	} else if (show_time) {
		let h = String(hour).padStart(2, '0')
		let m = String(min).padStart(2, '0')
		return `${month_en[month]} ${day} ${year}, ${h}:${m}`
	} else {
		return `${month_en[month]} ${day} ${year}`
		// return `${year}年${month}月${day}日 (星期${weekday})`
	}
}