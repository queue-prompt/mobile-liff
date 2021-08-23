import _ from 'lodash-core'
import { monthList } from './birthDate'

function formatDate(date) {
  const dateSplit = date.split('-')

  let monthName = _.filter(monthList, { monthId: dateSplit[1] })
  monthName = monthName[0].name

  const parseDay = parseInt(dateSplit[2])
  const yearTh = parseInt(dateSplit[0]) + 543
  const newFormat = `${parseDay} ${monthName} ${yearTh}`

  return newFormat
}

function formatDateWithoutYear(date) {
  const dateSplit = date.split('-')

  let monthName = _.filter(monthList, { monthId: dateSplit[1] })
  monthName = monthName[0].name

  const parseDay = parseInt(dateSplit[2])
  const newFormat = `${parseDay} ${monthName}`

  return newFormat
}

function monthNameById(date) {
  const dateSplit = date.split('-')
  let monthName = _.filter(monthList, { monthId: dateSplit[1] })
  return monthName[0].name
}

function formatTime(time) {
  const timeList = time.split('-')

  let start = timeList[0]
  let end = timeList[1]

  start = start[0] + start[1] + ':' + start[2] + start[3]
  end = end[0] + end[1] + ':' + end[2] + end[3]

  return `${start} - ${end} น.`
}

export {
  formatDate,
  formatDateWithoutYear,
  formatTime,

  monthNameById
}
