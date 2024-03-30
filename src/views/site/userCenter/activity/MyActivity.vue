<template>
  <div class="activity">
    <div class="activity-head">
      <p>我的活动</p>
    </div>
    <div class="activity-body">
      <el-table
        :data="list"
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="活动名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          label="联系方式"
          align="center">
          <template slot-scope="scope">
            {{scope.row.contact }} {{scope.row.contactPhone}}
          </template>
        </el-table-column>
        <el-table-column
          label="服务时长"
          align="center">
          <template slot-scope="scope">
            {{scope.row.duration + '小时' }}
          </template>
        </el-table-column>
        <el-table-column
          label="加入时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.registrationTime | changeTime('{y}-{m}-{d}')}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100">
          <template slot-scope="scope">
            <span :class="getSignUpStatus(scope.row.state).color">
              {{ getSignUpStatus(scope.row.state).status}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.state === 1
                  && (scope.row.duration === '0' || scope.row.duration === '0.00')"
               class="el-link el-link--danger"
               @click="handleDel(scope)">
              <span class="el-link--inner">脱离</span>
            </a>
            <a v-if="scope.row.state === 1" class="el-link el-link--danger" @click="applyDuration(scope)">
              <span class="el-link--inner">申请时长</span>
            </a>
            <a v-if="scope.row.state === 0 || !scope.row.duration" class="el-link el-link--danger" @click="handleDel(scope)">
              <span class="el-link--inner">删除</span>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"></Pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="录入时长">
      <el-form :model="durationInfo" :rules="rules" ref="durationInfoForm" label-width="120px" label-position="right">
        <el-form-item label="活动名称">
          <span>{{signUp.title}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="15">
            <el-form-item label="服务时长" prop="duration">
              <el-input v-model="durationInfo.duration" :min="0" @change="checkValue" placeholder="请输入服务时长"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="durationInfo.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <span style="display:inline-block;position: absolute;margin-top: -20px">如：2015-8-12上午8:00-9:00帮助他人浇花</span>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveDuration('durationInfoForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import {fetchSignUpByUidByPage,deleteSignUp} from "@/api/admin/signUp";
import {deepClone} from "@/utils";
import {createDurationInfo} from "@/api/admin/durationInfo";

const defaultDuration = {
  id:'',
  activityId:'',
  userId:'',
  remarks:'',
  duration:'',
  addMethod:'',
  state:''
}

export default {
  name: "Activity",
  components: {Pagination},
  data(){
    return {
      list:[],
      listLoading: true,
      total:0,
      listQuery:{
        page:1,
        limit:10
      },
      signUp:{},
      dialogVisible:false,
      durationInfo:Object.assign(defaultDuration,{}),
      rules:{
        duration:[{required: true, message: '请输入服务时长', trigger: 'blur'}],
        remarks:[{required: true, message: '请输入备注', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchSignUpByUidByPage(this.listQuery).then(resp => {
        this.list = resp.data.data
        this.total = resp.data.total
        // console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    getSignUpStatus(val){
      let status = '';
      let color = ''
      switch (val) {
        case -1:
          status = '审核失败'
          break;
        case 0:
          status = '申请中'
          color = 'red'
          break;
        case 1:
          status = '已加入'
          color = 'green'
          break;
      }
      return {status,color}
    },
    // 更改表头样式
    tableHeaderColor({ rowIndex}){
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #666;'
      }
    },
    handleDel({ $index, row }) {
      this.$confirm('确定删除该记录吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteSignUp({id:row.id})
        if (resp.data.code === 200){
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    applyDuration({ $index, row }){
      this.dialogVisible = true
      this.signUp = deepClone(row)
    },
    checkValue(){
      let value = '' + this.durationInfo.duration;
      value = value
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第⼀个. 清除多余的
        .replace(/^\./g, '')    //保证第⼀个为数字⽽不是.
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输⼊两个⼩数
      if (value.indexOf('.') < 0 && value !== '') {
        // 以上已经过滤，此处控制的是如果没有⼩数点，⾸位不能为类似于 01、02的⾦额
        value = parseFloat(value);
      }
      this.durationInfo.duration = value;
    },
    saveDuration(formName){
      this.durationInfo.activityId = this.signUp.activityId
      this.durationInfo.userId = this.signUp.userId
      this.durationInfo.addMethod = '个人申请'
      this.durationInfo.state = 0 // 0 表示未审核
      console.log(this.signUp,this.durationInfo)
      this.$refs[formName].validate((valid) => {
        if (valid) {
         createDurationInfo(this.durationInfo).then(resp => {
           if (resp.data.code === 200){
             this.$message.success(resp.data.msg)
             this.dialogVisible = false
             this.getList()

             // 提交成功后清空表单数据
             this.$refs['durationInfoForm'].resetFields()
           }
         })
        }
      })
    }
  }
}
</script>

<style scoped>
.activity-head{
  padding: 12px;
  margin-bottom: 10px;
  background-color: rgb(255,240,241);
}
.activity-head p{
  font-size: 14px;
}
.red{
  color: #F56C6C;
}
.green{
  color: #67C23A;
}
</style>
