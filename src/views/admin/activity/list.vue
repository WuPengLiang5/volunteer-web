<template>
  <div class="activity-layout">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label" :name="item.name">
        <fieldset class="search-fieldset">
          <legend>搜索活动</legend>
          <div class="search">
            <el-form ref="searchForm"
                     :model="searchForm"
                     class="searchForm"
                     label-width="70px">
              <el-row type="flex" align="middle">
                <el-col :span="7">
                  <el-form-item label="活动名">
                    <el-input v-model="searchForm.title" placeholder="请输入活动名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="活动地点">
                    <el-input v-model="searchForm.location" placeholder="请输入活动地点"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :offset="1">
                  <el-form-item label="人数上限">
                    <el-input v-model.number="searchForm.registerMax" placeholder="精确搜索"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" :offset="1">
                  <el-button class="search-button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </fieldset>
        <div class="activity-layout-content">
          <div class="operation">
            <div class="operation-button">
              <el-button type="primary" @click="navigateTo('create')">新增活动</el-button>
              <el-button type="danger" :disabled="!isDelete"  @click="massDeletion">删除活动</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            :header-cell-style="tableHeaderColor"
            border
            style="width: 100%"
            :default-sort = "{prop: 'id', order: 'ascending'}"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"/>
            <el-table-column
              v-if="false"
              prop="id"
              label="编号"/>
            <el-table-column
              prop="title"
              align="center"
              label="活动名"
              show-overflow-tooltip
              width="150"/>
            <el-table-column
              prop="contact"
              align="center"
              width="100"
              label="联系人"/>
            <el-table-column
              prop="contactPhone"
              align="center"
              width="115"
              label="手机"/>
            <el-table-column
              prop="location"
              align="center"
              min-width="100"
              label="活动地点"/>
            <el-table-column
              prop="registerMax"
              label="人数上限"
              width="100"
              align="center"/>
            <el-table-column
              prop="state"
              width="100"
              align="center"
              label="活动状态">
              <template slot-scope="scope">
                <el-tag :type="showStatus(scope.row.state)" effect="dark">
                  {{ scope.row.state | getActivityState }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              align="center">
              <template slot-scope="scope">
                <a v-if="scope.row.state === -1" class="el-link el-link--primary" @click="publish(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                  <span class="el-link--inner">发布项目</span>
                </a>
                <a v-has="'sys:activity:audit'" v-if="scope.row.state === 0" class="el-link el-link--primary" @click="handleAudit(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                  <span class="el-link--inner">审核</span>
                </a>
                <a v-if="scope.row.state === 1" class="el-link el-link--primary" @click="recordTime(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                  <span class="el-link--inner">记时</span>
                </a>
                <a v-if="scope.row.state !== 2" class="el-link el-link--primary" @click="handleEdit(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                  <span class="el-link--inner">编辑</span>
                </a>
                <el-popover
                  v-if="scope.row.state !== 1"
                  placement="top"
                  width="160"
                  trigger="click"
                  :ref="`popover-${scope.$index}`">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" round @click="handleCancel(scope)">取消</el-button>
                    <el-button type="primary" size="mini" round @click="handleDel(scope)">确定</el-button>
                  </div>
                  <a slot="reference" class="el-link el-link--danger">
                    <i class="el-icon-delete"></i>
                    <span class="el-link--inner">删除</span>
                  </a>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20, 25, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisibleAudit" title="审核志愿活动">
      <el-form :model="activity" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="志愿活动状态" prop="state">
              <el-radio-group v-model="activity.state">
                <el-radio disabled :label="0">待审核</el-radio>
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-2">审核不通过</el-radio>
              </el-radio-group>
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
import {fetchActivityList, delBatchActivities, deleteActivity, updateActivity} from '@/api/admin/activity'
import {deepClone} from "@/utils";
import {updateNews} from "@/api/admin/news";
export default {
  name: "index",
  data(){
    return {
      activeName:'-1',
      tabs:[
        {label:'未发布',name:'-1'},
        {label:'待审核',name:'0'},
        {label:'运行中',name:'1'},
        {label:'已结束',name:'2'}],
      list:[],
      multipleSelection: [],
      isDelete: false,
      searchForm: {
        title:'',
        location:'',
        registerMax:'',
        state:'-1',

        page:'',
        limit:''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisibleAudit:false,
      activity:{}
    }
  },
  created() {
    this.fetchData()
  },
  methods:{
    fetchData(){
      this.searchForm.page = this.currentPage
      this.searchForm.limit = this.pageSize
      fetchActivityList(this.searchForm).then(resp => {
        if (resp.data.code === 200){
          this.list = resp.data.data
          this.total = resp.data.total
          // console.log(this.list)
        }
      })
    },
    handleClick(tab,event){
      this.searchForm.state = tab.name
      this.fetchData()
      // console.log(tab.name, event);
      // console.log(this.activeName)
    },
    // 搜索
    search(){
      this.currentPage = 1;

      this.searchForm.page = this.currentPage
      this.searchForm.limit = this.pageSize

      fetchActivityList(this.searchForm).then(resp =>{
        if(resp.data.code === 200){
          this.list = resp.data.data
          this.total = resp.data.total
        }
      })
    },
    navigateTo(val) {
      this.$router.push({ path: '/admin/activity/' + val })
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
        delBatchActivities(params).then(resp => {
          if (resp.data.code === 200) {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            });
            this.fetchData()
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
    showStatus(val) {
      switch (val) {
        case -1: return 'info'
        case 0: return 'warning'
        case 1: return 'success'
        case 2: return 'danger'
      }
    },
    publish(index,row){
      let activity = deepClone(row)
      activity.createTime = new Date()
      activity.state = 0
      updateActivity(activity).then(resp => {
        if (resp.data.code === 200){
          this.$message({
            type: "success",
            message:"发布成功"
          })
          this.searchForm.state = -1
          this.fetchData()
        }
      })
    },
    handleAudit(index, row){
      this.dialogVisibleAudit = true
      this.activity = deepClone(row)
    },
    saveAudit(){
      updateActivity(this.activity).then(resp => {
        if (resp.data.code === 200){
          this.dialogVisibleAudit = false
          if (this.activity.state === 1){
            this.$message.success('审核通过')
          }else {
            this.$message.error('审核不通过')
          }
          this.searchForm.state = 0
          this.fetchData()
        }
      })
    },
    recordTime(index, row){
      this.$router.push({
        path: '/admin/signup/durationInfo',
        query: {
          id: row.id
        }
      })
    },
    handleEdit(index, row) {
      // console.log(row.id)
      this.$router.push({
        path: '/admin/activity/edit',
        query: {
          id: row.id
        }
      })
    },
    //取消删除
    handleCancel(scope){
      console.log(scope._self.$refs[`popover-${scope.$index}`])
      scope._self.$refs[`popover-${scope.$index}`][3].doClose()
      this.toggleSelection();
      this.isDelete = false;
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
    handleDel(scope) {
      scope._self.$refs[`popover-${scope.$index}`][3].doClose()

      // 封装参数
      let params = new URLSearchParams();
      params.append("id",scope.row.id)

      deleteActivity(params).then(resp => {
        if (resp.data.code === 200) {
          this.$message({
            message: resp.data.msg,
            type: 'success'
          })
          this.fetchData()
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style scoped>
.activity-layout{
  margin: 10px;
}
.search-fieldset{
  margin: 0;
  border: 1px solid #e6e6e6;
  padding: 10px 20px 5px 20px;
  color: #6b6b6b;
  font: 14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;
}
.activity-layout-content{
  margin-top: 10px;
  border: 1px solid #d8dce5;
}
.search{
  margin: 10px;
}
.searchForm .el-form-item{
  margin-bottom: 10px;
}
.search-button{
  /*margin-left: 42px;*/
  margin-bottom: 10px;
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
.table-pagination{
  height: 40px;
  display: flex;
  align-items: center;
  padding: 7px;
  position: relative;
  top: 0;
}
</style>
