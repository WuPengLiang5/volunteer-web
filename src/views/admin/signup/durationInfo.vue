<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="时长录入" name="enterDuration">
        <div class="app-container-content">
          <div class="operation">
            <div class="operation-button">
              <el-button type="primary" size="small"
                         :disabled="multipleSelection.length === 0"
                         @click="entryMassDuration">
                录入时长
              </el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            class="data-table"
            :data="volunteerList"
            v-loading="vListLoading"
            tooltip-effect="dark"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
              type="selection"
              width="55"
              align="center"/>
            <el-table-column
              prop="id"
              label="序号"
              width="50"
              show-overflow-tooltip
              align="center"/>
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
              min-width="100"/>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              min-width="100"/>
            <el-table-column
              prop="phone"
              align="center"
              label="手机"
              min-width="100"/>
            <el-table-column
              prop="email"
              align="center"
              label="邮箱"
              min-width="100"/>
            <el-table-column
              prop="address"
              align="center"
              label="居住区域"
              min-width="100"/>
            <el-table-column
              prop="durations"
              width="120"
              align="center"
              label="服务总时长">
              <template slot-scope="scope">
                {{ scope.row.durations}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="190"
              align="center">
              <template slot-scope="scope">
                <a class="el-link el-link--primary" @click="entryDuration(scope)">
                  <i class="el-icon-edit"></i>
                  <span class="el-link--inner">录入</span>
                </a>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getVolunteerList" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="时长审批" name="examineDuration">
        <div class="app-container-content">
          <div class="operation">
            <div class="operation-button">
              <el-button type="primary" size="small" :disabled="multipleSelection.length === 0" @click="passExamine">通过</el-button>
              <el-button type="danger" size="small" :disabled="multipleSelection.length === 0" @click="refuseExamine">拒绝</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            class="data-table"
            :data="durationInfoList"
            v-loading="dListLoading"
            tooltip-effect="dark"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
              type="selection"
              width="55"
              align="center"/>
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
              min-width="100"/>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              min-width="100"/>
            <el-table-column
              align="center"
              label="联系方式"
              min-width="100">
              <template slot-scope="scope">
                {{scope.row.phone}},{{scope.row.email}}
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              align="center"
              label="备注"
              min-width="100"/>
            <el-table-column
              prop="duration"
              width="120"
              align="center"
              label="申请时长">
              <template slot-scope="scope">
                {{ scope.row.duration }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="120"
              align="center"
              label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | changeTime('{y}-{m}-{d}') }}
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="d_total>0" :total="d_total" :page.sync="dListQuery.page" :limit.sync="dListQuery.limit" @pagination="getDurationInfoList" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="时长记录" name="recordDuration">
        <div class="app-container-content">
          <div class="operation">
            <div class="operation-button">
              <el-button type="danger" size="small" :disabled="!isDelete"  @click="massDeletion">删除时长信息</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            class="data-table"
            :data="durationInfoList"
            v-loading="dListLoading"
            tooltip-effect="dark"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
              type="selection"
              width="55"
              align="center"/>
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
              min-width="100"/>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              min-width="100"/>
            <el-table-column
              align="center"
              label="联系方式"
              min-width="100">
              <template slot-scope="scope">
                <span style="display: block">{{scope.row.phone}}</span>
                <span>{{scope.row.email}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remarks"
              align="center"
              label="备注"
              min-width="100"/>
            <el-table-column
              width="120"
              align="center"
              label="申请时长">
              <template slot-scope="scope">
                <span style="display: block">
                  {{ scope.row.duration}}
                </span>
                <span style="color: green">
                   {{scope.row.addMethod}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              align="center"
              label="申请时间"
              min-width="90">
              <template slot-scope="scope">
                {{scope.row.createTime | changeTime('{y}-{m}-{d}') }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="190"
              align="center">
              <template slot-scope="scope">
                <a class="el-link el-link--danger" @click="handleDel(scope)">
                  <i class="el-icon-delete"></i>
                  <span class="el-link--inner">删除</span>
                </a>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="d_total>0" :total="d_total" :page.sync="dListQuery.page" :limit.sync="dListQuery.limit" @pagination="getDurationInfoList" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisibleDuration" title="录入时长">
      <el-form :model="durationInfo" :rules="rules" ref="durationInfoForm" label-width="120px" label-position="right">
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
              <el-input v-model="durationInfo.remarks" placeholder="请输入审核原因" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <span style="display:inline-block;position: absolute;margin-top: -20px">如：2015-8-12上午8:00-9:00帮助他人浇花</span>
        </el-form-item>
      </el-form>
      <div style="text-align:center;">
        <el-button type="danger" @click="dialogVisibleDuration=false">取消</el-button>
        <el-button type="primary" @click="saveDuration('durationInfoForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createDurationInfo, createDurationInfoByGroup, delBatchDurationInfos,
  deleteDurationInfo, examineDuration,
  fetchDurationList,
  fetchInputDurationOfVolunteer
} from "@/api/admin/durationInfo";
import pagination from "@/components/Pagination/index";
import {fetchDictByType} from "@/api/admin/dict";
import {deepClone} from "@/utils";

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
  name: "durationInfo",
  components:{
    pagination
  },
  data(){
    return{
      volunteerList:[],
      durationInfoList:[],
      multipleSelection: [],
      isDelete: false,
      vListLoading: true,
      dListLoading:true,
      listQuery:{
        page: 1,
        limit: 10
      },
      dListQuery:{
        activityId:'',
        // 时长信息的状态
        state:'',
        page:1,
        limit:10
      },
      total:0,
      d_total:0,
      activeName: 'enterDuration',
      dialogVisibleDuration:false,
      durationInfo:Object.assign(defaultDuration,{}),
      rules:{
        duration:[{required: true, message: '请输入服务时长', trigger: 'blur'}],
        remarks:[{required: true, message: '请输入备注', trigger: 'blur'}]
      },
      entryDurationIds:[]
    }
  },
  created() {
    this.dListQuery.activityId = this.$route.query && this.$route.query.id
    this.listQuery.activityId = this.$route.query && this.$route.query.id
    this.getVolunteerList()
  },
  methods:{
    getVolunteerList(){
      this.vListLoading = true
      fetchInputDurationOfVolunteer(this.listQuery).then(resp => {
        this.volunteerList = resp.data.data
        this.total = resp.data.total

        setTimeout(() => {
          this.vListLoading = false
        }, 1.5 * 500)
      })
    },
    getDurationInfoList(){
      this.dListLoading = true
      fetchDurationList(this.dListQuery).then(resp => {
        this.durationInfoList = resp.data.data
        this.d_total = resp.data.total

        setTimeout(() => {
          this.dListLoading = false
        }, 1.5 * 500)
      })
    },
    handleClick() {
      if (this.activeName === 'enterDuration'){
        this.getVolunteerList()
      }
      if (this.activeName === 'examineDuration'){
        this.dListQuery.state = 0
        this.getDurationInfoList()
      }
      if (this.activeName === 'recordDuration'){
        this.dListQuery.state = 1
        this.getDurationInfoList()
      }

      this.multipleSelection = []
      // console.log(this.dListQuery)
      // console.log(tab, event);
    },
    entryMassDuration(){
      if (this.multipleSelection.length === 0){
        this.$message.error("请至少选择一项")
      }

      let idArr = [];
      this.multipleSelection.forEach(function(value, index) {
        idArr.push(value.uid)
      })
      this.entryDurationIds = idArr
      this.dialogVisibleDuration = true
    },
    // 录入时长
    entryDuration({$index,row}){
      this.dialogVisibleDuration = true
      this.entryDurationIds.push(row.id)
    },

    passExamine(){
      let idArr = [];
      this.multipleSelection.forEach(function(value, index) {
        idArr.push(value.id)
      })

      // 封装参数
      let params = new URLSearchParams();
      params.append('ids', idArr);
      params.append("state","1");
      params.append("activityId",this.dListQuery.activityId)

      examineDuration(params).then(resp => {
        if (resp.data.code){
          this.$message.success(resp.data.msg)
          this.getDurationInfoList()
        }
      })
    },
    refuseExamine(){
      let idArr = [];
      this.multipleSelection.forEach(function(value, index) {
        idArr.push(value.id)
      })

      // 封装参数
      let params = new URLSearchParams();
      params.append('ids', idArr);
      params.append("state","-1");
      params.append("activityId",this.dListQuery.activityId)

      examineDuration(params).then(resp => {
        // if (resp.data.code === 200){
        //   this.$message.success(resp.data.msg)
          this.getDurationInfoList()
        // }
      })
    },
    //多条删除
    massDeletion() {
      let idArr = [];
      this.multipleSelection.forEach(function(value, index) {
        idArr.push(value.id)
      })

      // 封装参数
      let params = new URLSearchParams();
      params.append('ids', idArr);

      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBatchDurationInfos(params).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            });
            this.getDurationInfoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 更改表头样式
    tableHeaderColor({ rowIndex}){
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #666;'
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length === 0){
        this.isDelete = false
      }else {
        this.isDelete = true
      }
    },
    handleDel({ $index, row }) {
      this.$confirm('确定删除时长信息吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteDurationInfo({id:row.id})
        if (resp.data.code === 200){
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
          this.getDurationInfoList()
        }
      }).catch(err => {
        console.log(err)
      })
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
      this.durationInfo.activityId = this.$route.query && this.$route.query.id
      this.durationInfo.addMethod = '团体录入'
      this.durationInfo.state = 1 // 1 表示已审核

      let params ={
        "ids":this.entryDurationIds,
        'durationInfo':JSON.stringify(this.durationInfo)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createDurationInfoByGroup(params).then(resp => {
            if (resp.data.code === 200){
              this.$message.success(resp.data.msg)
              this.dialogVisibleDuration = false // 隐藏弹框
              this.getVolunteerList() // 更新数据列表
              this.$refs[formName].resetFields() // 清空表单
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.app-container-content .operation{
  margin-bottom: 10px;
}
</style>
