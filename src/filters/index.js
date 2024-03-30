export { parseTime,changeTime} from '@/utils'

export function getActivityState(val){
  var status = ''
  switch (val) {
    case -1:
      status = '未发布'
      break;
    case 0:
      status = '待审核'
      break;
    case 1:
      status = '运行中'
      break;
    case 2:
      status = '已结束'
      break;
    case 10:
      status = '招募待启动'
      break;
    case 11:
      status = '招募中'
      break;
    case 12:
      status = '招募已结束'
      break;
  }
  return status
}

export function getNewsState(val){
  let status = '';
  switch (val) {
    case -1:
      status = '审核不通过'
      break;
    case 0:
      status = '待审核'
      break;
    case 1:
      status = '已审核'
      break;
  }
  return status
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
