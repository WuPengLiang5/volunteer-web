<template>
  <div>
    <div class="operation">
      <div class="operation-button">
<!--        <el-button type="primary" @click="navigateTo('create')">新增志愿者</el-button>-->
        <el-button type="danger" :disabled="!isDelete"  @click="massDeletion">删除志愿者</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      :header-cell-style="tableHeaderColor"
      width="100%"
      height="calc(100vh - 326px)"
      :default-sort = "{prop: 'id', order: 'ascending'}"
      @selection-change="handleSelectionChange"
      border>
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        v-if="false"
        prop="id"
        label="编号"/>
      <el-table-column
        prop="username"
        label="用户名"
        min-width="100"
        align="center"/>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="120"
        align="center"
        sortable/>
      <el-table-column
        prop="gender"
        label="性别"
        min-width="80"
        align="center"/>
      <el-table-column
        prop="idNumber"
        label="身份证号"
        min-width="100"
        align="center"
        show-overflow-tooltip
        sortable/>
      <el-table-column
        prop="politic"
        label="政治面貌"
        min-width="100"
        align="center"/>
      <el-table-column
        prop="occupation"
        label="职业"
        min-width="100"
        align="center"/>
      <el-table-column
        prop="location"
        label="注册所在地"
        min-width="100"
        align="center"/>
      <el-table-column
        prop="address"
        label="详细地址"
        min-width="100"
        align="center"/>
      <el-table-column
        label="操作"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <a class="el-link el-link--primary" @click="handleEdit(scope.$index, scope.row) ">
            <i class="el-icon-edit"></i>
            <span class="el-link--inner">编辑</span>
          </a>
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
            <a slot="reference" class="el-link el-link--danger">
              <i class="el-icon-delete"></i>
              <span class="el-link--inner">删除</span>
            </a>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 100px !important;">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import {fetchVolunteerList, createVolunteer, deleteVolunteer, updateVolunteer, fetchVolunteer, delBatchVolunteers} from '@/api/admin/volunteer'
import pagination from '@/components/Pagination'

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
      total:0,
      listLoading: true,
      listQuery:{
        page:1,
        limit:10
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchVolunteerList(this.listQuery).then(resp => {
        if (resp.data.code === 200){
          this.list = resp.data.data
          this.total = resp.data.total

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 500)
        }
      })
    },
    navigateTo(val){
      this.$router.push({ path: '/admin/volunteer/' + val })
    },
    //多条删除
    massDeletion() {
      let idArr = [];
      this.multipleSelection.forEach(function(value, index) {
        idArr.push(value.id)
      })

      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delBatchVolunteers(idArr).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success(resp.data.msg)
            this.getList()
          }
        })
      }).catch(() => {
        this.$message.info("已取消多条删除")
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
    handleEdit(index, row) {
      this.$router.push({
        path: '/admin/volunteer/edit',
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

      deleteVolunteer({id:scope.row.id}).then(resp => {
        if (resp.data.code === 200){
          this.$message.success(resp.data.msg)
          this.list.splice(scope.$index, 1)
          this.getList()
        }
      })
    },
  }
}
</script>

<style scoped>
.operation{
  text-align: left;
  background-color: #FAFAFA;

  position: relative;
  /*width: 100%;*/
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
</style>
