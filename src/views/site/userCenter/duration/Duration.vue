<template>
  <div class="duration">
    <div class="duration-head">
      <p>我的服务时长</p>
    </div>
    <div class="duration-body">
      <el-table
        :data="list"
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
        style="width: 100%">
        <el-table-column
        label="服务时长"
        align="center">
        <template slot-scope="scope">
          {{scope.row.duration + '小时' }}
        </template>
      </el-table-column>
        <el-table-column
        label="备注"
        align="center">
        <template slot-scope="scope">
          {{scope.row.remarks }}
        </template>
      </el-table-column>
        <el-table-column
          prop="addMethod"
          label="添加方式"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
            <span :class="getDurationStatus(scope.row.state).color">
              {{ getDurationStatus(scope.row.state).status}}
            </span>
        </template>
      </el-table-column>
        <el-table-column
          prop="title"
          label="活动名"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          label="日期"
          align="center">
          <template slot-scope="scope">
            {{scope.row.createTime | changeTime('{y}-{m}-{d}')}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import {fetchSignUpByUidByPage} from "@/api/admin/signUp";
import {fetchDurationListByUserId} from "@/api/admin/durationInfo";

export default {
  name: "Duration",
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
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchDurationListByUserId(this.listQuery).then(resp => {
        this.list = resp.data.data
        this.total = resp.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    // 更改表头样式
    tableHeaderColor({ rowIndex}){
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #666;'
      }
    },
    getDurationStatus(val){
      let status = '';
      let color = ''
      switch (val) {
        case -1:
          status = '审核失败'
          break;
        case 0:
          status = '待审核'
          color = 'red'
          break;
        case 1:
          status = '已生效'
          color = 'green'
          break;
      }
      return {status,color}
    },
  }
}
</script>

<style scoped>
.duration-head{
  padding: 12px;
  margin-bottom: 10px;
  background-color: rgb(255,240,241);
}
.duration-head p{
  font-size: 14px;
}
.red{
  color: red;
}
.green{
  color: green;
}
</style>
