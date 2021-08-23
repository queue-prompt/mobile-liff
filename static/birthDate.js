function rangeYearList (startYear, endYear) {
  const yearList = []
  for(let i= endYear; i >= startYear; i--) {
    yearList.push(i)
  }
  return yearList
}

const yearList = rangeYearList(2464, 2552)


const monthList = [
  { name: 'มกราคม', monthId: '01' },
  { name: 'กุมภาพันธ์', monthId: '02' },
  { name: 'มีนาคม', monthId: '03' },
  { name: 'เมษายน', monthId: '04' },
  { name: 'พฤษภาคม', monthId: '05' },
  { name: 'มิถุนายน', monthId: '06' },
  { name: 'กรกฎาคม', monthId: '07' },
  { name: 'สิงหาคม', monthId: '08' },
  { name: 'กันยายน', monthId: '09' },
  { name: 'ตุลาคม', monthId: '10' },
  { name: 'พฤศจิกายน', monthId: '11' },
  { name: 'ธันวาคม', monthId: '12' },
]

const dateList = [  
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
]

export {
  dateList,
  monthList,
  yearList
}