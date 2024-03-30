<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.state" placeholder="报名信息状态" clearable class="filter-item" style="width: 130px" size="medium">
        <el-option v-for="item in signupState" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <div class="app-container-content">
      <div class="operation">
        <div class="operation-button">
          <el-button type="danger" :disabled="!isDelete"  @click="massDeletion">删除报名信息</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        class="data-table"
        :data="list"
        v-loading="listLoading"
        tooltip-effect="dark"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        height="247"
        border>
        <el-table-column
          type="selection"
          width="55"
          align="center"/>
        <el-table-column
          prop="id"
          label="序号"
          width="150"
          show-overflow-tooltip
          align="center"/>
        <el-table-column
          prop="title"
          label="活动名"
          width="150"
          show-overflow-tooltip
          align="center"/>
        <el-table-column
          prop="name"
          align="center"
          label="报名人姓名"
          min-width="100"/>
        <el-table-column
          prop="state"
          align="center"
          label="报名状态"
          min-width="120">
          <template slot-scope="scope">
            <el-tag :type="getSignUpState(scope.row.state).color">
              {{ getSignUpState(scope.row.state).stateText}}
            </el-tag>
          </template>
        </el-table-column>>
<!--        <el-table-column-->
<!--          prop="auditReason"-->
<!--          width="120"-->
<!--          align="center"-->
<!--          label="审核原因">-->
<!--          <template slot-scope="scope">-->
<!--            {{ scope.row.auditReason }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="duration"
          width="120"
          align="center"
          label="服务时长">
          <template slot-scope="scope">
            {{ scope.row.duration ? scope.row.duration + "小时":"0.00小时"}}
          </template>
        </el-table-column>
        <el-table-column
          prop="registrationTime"
          align="center"
          label="报名时间"
          min-width="90">
          <template slot-scope="scope">
            {{scope.row.registrationTime | changeTime('{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190"
          align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.state === 0" class="el-link el-link--primary" @click="handleAudit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
              <span class="el-link--inner">审核</span>
            </a>
            <a class="el-link el-link--primary" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-icon-view"></i>
              <span class="el-link--inner">查看</span>
            </a>
            <a class="el-link el-link--danger" @click="handleDel(scope)" v-if="scope.row.duration === '0'">
              <i class="el-icon-delete"></i>
              <span class="el-link--inner">删除</span>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :visible.sync="dialogVisible" title="编辑报名信息">
      <el-form :model="signup" ref="postForm" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="15">
            <el-form-item label="报名人姓名" prop="state">
              <el-input v-model="signup.name" disabled/>
            </el-form-item>
            <el-form-item label="服务时长" prop="duration">
              <el-input v-model="signup.duration" disabled :min="0" @change="checkValue" placeholder="请输入服务时长"/>
            </el-form-item>
            <el-form-item label="审核报名状态" prop="state">
              <el-select v-model="signup.state" disabled>
                <el-option
                  v-for="item in signupState"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核未通过原因" v-if="signup.state === -1" prop="auditReason">
              <el-input type="textarea" rows="5" v-model="signup.auditReason" disabled/>
            </el-form-item>
            <el-form-item label="报名时间" prop="registrationTime">
              <el-input v-model="signup.registrationTime" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleAudit" title="审核报名信息">
      <el-form :model="signup" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核报名状态" prop="state">
              <el-radio-group v-model="signup.state">
                <el-radio disabled :label="0">未审核</el-radio>
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-1">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="审核未通过原因" v-if="signup.state === -1" prop="auditReason">
              <el-input type="textarea" rows="5" v-model="signup.auditReason" placeholder="请输入审核原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center;">
        <el-button type="danger" @click="dialogVisibleAudit=false">取消</el-button>
        <el-button type="primary" @click="saveAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import {fetchSignUpListByPage,delBatchSignUps,deleteSignUp,updateSignUp} from "@/api/admin/signUp";
import {deepClone} from "@/utils";

export default {
  name: "index",
  components:{
    pagination
  },
  data(){
    return {
      list:[],
      multipleSelection: [],
      isDelete: false,

      listLoading: true,
      listQuery:{
        state:'',
        page:1,
        limit:10
      },
      total:0,
      signupState:[{key:-1,label:'审核未通过'},{key:0,label:'未审核'},{key:1,label:'审核通过'}],
      dialogVisibleAudit: false,
      dialogVisible:false,
      signup:{
        id:'',
        state:'',
        auditReason:'',
        name:'',
        registrationTime:'',
        duration:''
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchSignUpListByPage(this.listQuery).then(resp => {
        this.list = resp.data.data
        this.total = resp.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        delBatchSignUps(params).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            });
            this.getList()
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
    getSignUpState(val){
      let stateText
      let color
      switch (val){
        case -1:
          stateText = '审核未通过';
          color = 'error'
          break;
        case 0:
          stateText = '审核中';
          color = ''
          break;
        case 1:
          stateText = '审核通过';
          color = 'success'
          break;
      }
      return {stateText:stateText,color:color}
    },
    handleEdit(index, row) {
      this.dialogVisible = true
      this.signup = deepClone(row)
    },
    handleAudit(index, row) {
      this.dialogVisibleAudit = true
      this.signup = deepClone(row)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleDel({ $index, row }) {
      this.$confirm('确定删除报名信息吗?', '提示', {
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
    checkValue(){
      let value = '' + this.signup.duration;
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
      this.signup.duration = value;
    },
    save(){
      this.$refs['postForm'].validate((valid) => {
        if (valid){
          updateSignUp(this.signup).then(resp => {
            if (resp.data.code === 200){
              this.dialogVisible = false
              this.$message.success(resp.data.msg)
              this.getList()
            }
          })
        }
      })
    },
    saveAudit(){
      console.log(this.signup)
      updateSignUp(this.signup).then(resp => {
        if (resp.data.code === 200){
          this.dialogVisibleAudit = false
          this.$message.success(resp.data.msg)
          this.getList()
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container{
  margin: 10px;
}
.filter-container .filter-item{

}
.app-container-content{
  margin-top: 10px;
  border: 1px solid #d8dce5;
}
.operation{
  text-align: left;
  background-color: #FAFAFA;

  position: relative;
  min-height: 39px;
  line-height: 39px;
  padding: 10px 15px;
  border-width: 0 0 1px;
  border-bottom: 1px solid #d8dce5;
}
.operation-button button{
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  font-size: 12px;
}
.data-table{
  width: 100%;
}
</style>
