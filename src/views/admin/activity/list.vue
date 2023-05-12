<template>
  <div class="activity-layout">
    <fieldset class="search-fieldset">
      <legend>搜索活动</legend>
      <div class="search">
        <el-form ref="searchForm"
                 :model="searchForm"
                 class="searchForm"
                 label-width="110px"
                  :inline="true">
          <el-form-item label="活动名">
            <el-input v-model="searchForm.title" placeholder="请输入活动名"></el-input>
          </el-form-item>
          <el-form-item label="活动地点">
            <el-input v-model="searchForm.location" placeholder="请输入活动地点"></el-input>
          </el-form-item>
          <el-form-item label="人数上限">
            <el-input v-model.number="searchForm.registerMax" placeholder="精确搜索"></el-input>
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select v-model="searchForm.state" style="width: 208px;" placeholder="请选择活动状态">
              <el-option label="招募待启动" value="0"></el-option>
              <el-option label="招募中" value="1"></el-option>
              <el-option label="招募已结束" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="search-button" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
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
          sortable/>
        <el-table-column
          prop="location"
          align="center"
          label="活动地点"
          sortable/>
        <el-table-column
          prop="registerMax"
          label="人数上限"
          width="100"
          align="center"
          sortable/>
        <el-table-column
          prop="state"
          width="100"
          align="center"
          label="活动状态"
          sortable>
          <template slot-scope="scope">
            <el-button :type="showStatus(scope.row.state)" size="mini">
              {{ scope.row.state | getActivityState }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;justify-content: space-between">
            <span>
              <el-button
                type="primary"
                size="small"
                @click="publish(scope.$index, scope.row)">发布</el-button>
            </span>
              <span>
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </span>
              <el-popover
                placement="top"
                width="160"
                trigger="click"
                :ref="`popover-${scope.$index}`">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin-top: 10px">
                  <el-button size="mini" round @click="handleCancel(scope)">取消</el-button>
                  <el-button type="primary" size="mini" round @click="handleDel(scope)">确定</el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger">删除</el-button>
              </el-popover>
            </div>

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
  </div>
</template>

<script>
import {fetchActivityList, delBatchActivities, deleteActivity} from '@/api/activity'
export default {
  name: "index",
  data(){
    return {
      list:[],
      multipleSelection: [],
      isDelete: false,
      searchForm: {
        title:'',
        location:'',
        registerMax:'',
        state:'',

        page:'',
        limit:''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0
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
          console.log(this.list[8])
        }
      })
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
        case 0: return 'info'
        case 1: return 'success'
        case 2: return 'warning'
        case 3: return 'danger'
      }
    },
    publish(index,row){
      this.$message("发布成功")
      console.log(row)
    },
    handleEdit(index, row) {
      console.log(row.id)
      this.$router.push({
        path: '/admin/activity/edit',
        query: {
          id: row.id
        }
      })
    },
    //取消删除
    handleCancel(scope){
      scope._self.$refs[`popover-${scope.$index}`].doClose()
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
      scope._self.$refs[`popover-${scope.$index}`].doClose()

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
  margin-left: 42px;
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
