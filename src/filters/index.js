export function getActivityState(val){
  var status = ''
  switch (val) {
    case -1:
      status = '已取消'
      break;
    case 0:
      status = '招募待启动'
      break;
    case 1:
      status = '招募中'
      break;
    case 2:
      status = '招募已结束'
      break;
    case 3:
      status = '已结束'
      break;
  }
  return status
}

export function getNewsState(val){
  let status = '';
  switch (val) {
    case 0:
      status = '待审核'
      break;
    case 1:
      status = '已审核'
      break;
  }
  return status
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

// 东八区时间转换为年月日时分秒(2020-10-26T11:34:30Z转换为2020-10-26 11:34:30)
export function changeTime(date) {
  const json_date = new Date(date).toJSON();
  // console.log(json_date)
  // return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  return parseTime(new Date(json_date) + 8 * 3600 * 1000)
}

//业务类型（0其它 1新增 2修改 3删除）
export function getBusinessType(val){
  let status = '';
  switch (val) {
    case 0:
      status = '其它'
      break;
    case 1:
      status = '新增'
      break;
    case 2:
      status = '修改'
      break;
    case 3:
      status = '删除'
      break;
  }
  return status
}

// 菜单类型
export function getMenuType(val){
  let status = '';
  switch (val) {
    case 0:
      status = '目录'
      break;
    case 1:
      status = '菜单'
      break;
    case 2:
      status = '按钮'
      break;
  }
  return status
}

// 操作状态
export function getSysLogStatus(val){
  let status = '';
  switch (val) {
    case 0:
      status = '操作成功'
      break;
    case 1:
      status = '操作失败'
      break;
  }
  return status
}

export function setText(val){
  return val.replace(/<[^>]+>/g, "")
}

export function formatDate(time,cFormat){
  if (arguments.length === 0 || !time){
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  const date = new Date(time)

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return formatObj.y + '-' + (formatObj.m < 10 ? "0" + formatObj.m : formatObj.m) + "-" + (formatObj.d < 10 ? "0" + formatObj.d : formatObj.d)
}
