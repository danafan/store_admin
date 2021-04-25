//获得本月的结束日期 
export function getNowDate(type){ 
	let date = new Date(new Date());
	let year = date.getFullYear()
	let month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
	let day = date.getDate() > 10 ? date.getDate() : ('0' + date.getDate())
	if(type == 'is_time_start'){
		return `${year}-${month}-${day}` + " " + '00:00:00'
	}else if(type == 'is_time_end'){
		return `${year}-${month}-${day}` + " " + '23:59:59'
	}else{
		return `${year}-${month}-${day}`
	}
	
}