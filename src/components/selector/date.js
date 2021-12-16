//字符串拼接
function strFormat(str) {
	return str < 10 ? `0${str}` : str;
}
//时间戳转日期
export function timeStamp(time) {
	const dates = new Date(time)
	const year = dates.getFullYear()
	const month = dates.getMonth() + 1
	const date = dates.getDate()
	const day = dates.getDay()
	const hour = dates.getHours()
	const min = dates.getMinutes()
	const days = ['日', '一', '二', '三', '四', '五', '六']
	return {
		allDate: `${year}/${strFormat(month)}/${strFormat(date)}`,//注:此处ios系统如"-"分割无法显示,只能用"/"分割符
		date: `${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
		day: `星期${days[day]}`, //返回的礼拜天数  星期一
		hour: strFormat(hour) + ':' + strFormat(min) //返回的时钟 08:00
	}
}
//时间数组
export function timeData(currentDate = (new Date()).toString(), startTime = '09:00', endTime = '5:30', timeInterval = 1) {
	const time = []
	const date = timeStamp(Date.parse(currentDate)).allDate
	const startDate = `${date} ${startTime}`
	const endDate = `${date} ${endTime}`
	const startTimeStamp = new Date(startDate).getTime()
	const endTimeStamp = new Date(endDate).getTime()
	const timeStr = 3600 * 1000 * timeInterval
	let count = 0
	for (let i = startTimeStamp; i <= endTimeStamp; i = i + timeStr) {
		const timeObj = {}
		timeObj.time = timeStamp(i).hour
		timeObj.disable = 1
		timeObj.index = count
		time.push(timeObj)
		count++
	}
	return time
}

