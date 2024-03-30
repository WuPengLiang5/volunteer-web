<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户账号" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.module" placeholder="操作模块" style="width: 200px" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <div class="app-container-content">
      <el-table
        ref="multipleTable"
        class="data-table"
        :data="list"
        v-loading="listLoading"
        tooltip-effect="dark"
        :header-cell-style="tableHeaderColor"
        border>
        <el-table-column
          type="selection"
          width="45"
          align="center"
          fixed/>
        <el-table-column
          prop="id"
          label="ID"
          width="60"
          align="center"
          fixed/>
        <el-table-column
        prop="module"
        align="center"
        label="操作模块"
        min-width="100"/>
        <el-table-column
          prop="businessType"
          align="center"
          label="操作类型"
          min-width="100">
          <template slot-scope="scope">
            {{ scope.row.businessType | getBusinessType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          label="操作账号"
          min-width="100"/>
        <el-table-column
          prop="url"
          align="center"
          label="操作地址"
          min-width="150"
          show-overflow-tooltip/>
        <el-table-column
          prop="ip"
          align="center"
          label="操作IP"
          min-width="130"/>
        <el-table-column
          prop="requestMethod"
          align="center"
          label="请求方法"
          min-width="100"/>
        <el-table-column
          prop="status"
          align="center"
          label="操作状态"
          min-width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 0?'success':'danger'">
              {{ scope.row.status | getSysLogStatus}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="errorMsg"
          align="center"
          label="备注"
          min-width="130"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.errorMsg?scope.row.errorMsg:''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          min-width="160"
          sortable>
          <template slot-scope="scope">
            {{ scope.row.createTime | changeTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="90"
          align="center"
          fixed="right">
          <template slot-scope="scope">
            <a class="el-link el-link--primary" @click="getDetail(scope)">
              <i class="el-icon-view"></i>
              <span>详情</span>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="dialogVisible" title="详情" class="syslog-dialog">
      <el-form :model="sysLog" class="detail-form" label-width="82px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作用户:">
              <div>{{sysLog.username}}</div>
            </el-form-item>
            <el-form-item label="操作模块:">
              <div>{{sysLog.module}}</div>
            </el-form-item>
            <el-form-item label="操作时间:">
              <div>{{sysLog.createTime | changeTime }}</div>
            </el-form-item>
            <el-form-item label="请求方式:">
              <div>{{sysLog.requestMethod}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作IP:">
              <div>{{sysLog.ip}}</div>
            </el-form-item>
            <el-form-item label="操作类型:">
              <div>{{sysLog.businessType | getBusinessType}}</div>
            </el-form-item>
            <el-form-item label="操作状态:">
              <div>
                <el-tag :type="sysLog.status === 0?'success':'danger'">
                  {{sysLog.status | getSysLogStatus}}
                </el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-divider">
          <el-divider class="divider"></el-divider>
        </div>

        <el-form-item label="请求地址:">
          <div>{{sysLog.url}}</div>
        </el-form-item>
        <el-form-item label="调用方法:">
          <div>{{sysLog.method}}</div>
        </el-form-item>
        <el-form-item label="请求参数:">
          <div>{{sysLog.params}}</div>
        </el-form-item>
        <el-form-item label="操作结果:">
          <div>{{sysLog.jsonResult}}</div>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button size="mini" @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchSysLogList, fetchSysLog} from '@/api/admin/sysLog'
import pagination from "@/components/Pagination/index";
import {deepClone} from "@/utils";

const defaultSysLog = {
  id:'',
  username:'',
  module:'',
  createTime:'',
  requestMethod:'',
  ip:'',
  businessType:'',
  status,
  url:'',
  method:'',
  params:'',
  jsonResult:'',
}
export default {
  name: "SysLog",
  components:{
    pagination
  },
  data(){
    return {
      list:[],
      total:0,
      listLoading: true,
      listQuery:{
        username:'',
        module:'',

        page:1,
        limit:10
      },
      dialogVisible: false,
      dialogType: 'new',
      sysLog:Object.assign({},defaultSysLog)
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchSysLogList(this.listQuery).then(resp => {
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
    // 更改表头样式
    tableHeaderColor({ rowIndex}){
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #666;'
      }
    },
    getDetail(scope){
      this.dialogVisible = true
      this.sysLog = deepClone(scope.row)
    },
  }
}
</script>

<style scoped>
.app-container{
  margin: 5px 10px;
}
.app-container-content{
  margin: 10px 0;
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
.detail-form .el-form-item{
  margin-bottom: 10px;
}
.form-divider{
  margin: 12px 0;
}
.form-divider .divider{
  margin: 0;
}
</style>
