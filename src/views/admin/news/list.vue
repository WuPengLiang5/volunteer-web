<template>
  <div class="app-container">
    <div class="filter-container">
          <el-input v-model="listQuery.title" placeholder="新闻标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.source" placeholder="新闻来源" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.state" placeholder="新闻状态" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in newState" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
    <div class="app-container-content">
      <div class="operation">
        <div class="operation-button">
          <el-button type="primary" @click="navigateTo('create')">新增新闻</el-button>
          <el-button type="danger" :disabled="!isDelete"  @click="massDeletion">删除新闻</el-button>
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
        border>
        <el-table-column
          type="selection"
          width="55"
          align="center"/>
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"/>
        <el-table-column
          prop="title"
          align="center"
          label="新闻标题"
          min-width="200"
          sortable/>
        <el-table-column
          prop="source"
          align="center"
          label="来源"
          width="100"
          sortable/>
        <el-table-column
          prop="creator"
          align="center"
          label="发布人"
          width="100"
          sortable/>
        <el-table-column
          prop="createTime"
          align="center"
          label="发布时间"
          width="160"
          sortable>
          <template slot-scope="scope">
            {{ scope.row.createTime | changeTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          width="120"
          align="center"
          label="新闻状态"
          sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.state === 1?'success':'danger'">
            {{ scope.row.state | getNewsState }}
            </el-tag>
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
              <i class="el-icon-edit"></i>
              <span class="el-link--inner">编辑</span>
            </a>
            <a class="el-link el-link--danger" @click="handleDel(scope)">
              <i class="el-icon-delete"></i>
              <span class="el-link--inner">删除</span>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="dialogVisibleAudit" title="审核新闻信息">
      <el-form :model="news" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核新闻状态" prop="state">
              <el-radio-group v-model="news.state">
                <el-radio disabled :label="0">未审核</el-radio>
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-1">审核不通过</el-radio>
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
import {fetchNewsList,updateNews, deleteNews, delBatchNews} from '@/api/admin/news'
import pagination from '@/components/Pagination'
import ScrollPane from "@/views/admin/layout/components/TagsView/ScrollPane";
import {deepClone} from "@/utils";
import {updateSignUp} from "@/api/admin/signUp";

export default {
  name: "NewsList",
  components:{
    ScrollPane,
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
        title:'',
        source:'',
        state:'',
        sort: '+id',

        page:1,
        limit:10
      },
      newState:[{value:'0',label:'未审核'},{value:'1',label:'发布'},{value:'2',label: '审核不通过'}],
      sortOptions: [{ label: 'ID 递增', key: '+id' }, { label: 'ID 递减', key: '-id' }],
      dialogVisibleAudit:false,
      news:{}
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchNewsList(this.listQuery).then(resp => {
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
    navigateTo(val) {
      this.$router.push({ path: '/admin/news/' + val })
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
        delBatchNews(params).then(resp => {
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
    handleAudit(index, row) {
      this.dialogVisibleAudit = true
      this.news = deepClone(row)
      console.log(this.news)
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/admin/news/edit',
        query: {
          id: row.id
        }
      })
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
      this.$confirm('确定删除新闻吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteNews({newsId:row.id})
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
    saveAudit(){
      updateNews(this.news).then(resp => {
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
