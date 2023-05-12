<template>
  <div class="app-container">
    <div class="block">
      <el-row  :gutter="20">
        <el-col :span="3">
          <el-input v-model="listQuery.type" size="mini" placeholder="请输入字典类型" @keyup.enter.native="handleFilter"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.typeName" size="mini" placeholder="请输入类型名称" @keyup.enter.native="handleFilter"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.code" size="mini" placeholder="请输入字典编码" @keyup.enter.native="handleFilter"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="handleFilter">搜索</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">重置</el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">新增</el-button>
          <el-button type="success" size="mini" icon="el-icon-edit" @click.native="editDictTypeVisible = true">字典类型维护</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="app-container-content">
      <el-table
        :data="list"
        v-loading="listLoading"
        tooltip-effect="dark"
        :header-cell-style="tableHeaderColor"
        width="100%"
        border>
        <el-table-column
          min-width="80"
          label="ID"
          prop="id"/>
        <el-table-column label="字典类型" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.type}}
          </template>
        </el-table-column>
        <el-table-column label="字典类型名称" min-width="125" align="center">
          <template slot-scope="scope">
            {{scope.row.typeName}}
          </template>
        </el-table-column>
        <el-table-column label="字典编码" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column label="字典名称" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="编辑状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.editable === 1?'success':'danger'">
              {{scope.row.editable === 1?'可编辑':'不可编辑'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable === 1?'success':'danger'">
              {{scope.row.enable === 1?'启用':'禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.remark}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | changeTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateTime | changeTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="el-link el-link--primary" @click="handleEdit(scope)">
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

    <el-dialog
      :title="dialogType==='edit'?'编辑字典':'新增字典'"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form ref="form" :model="dictForm" :rules="rules" label-width="120px">
        <el-row v-if="dialogType !== 'edit'">
          <el-col :offset="4" :span="6">
            <el-radio-group v-model="inputType" size="medium" @change="changeInputType">
              <el-radio label="customize">自定义</el-radio>
              <el-radio label="select">选择</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="字典类型" prop="type">
              <el-select v-if="inputType === 'select'" style="width: 100%" v-model="dictForm.type" @change="getDictByType">
                <el-option
                  v-for="item in dictTypeList"
                  :key="item.type"
                  :label="item.typeName?item.typeName + '(' + item.type + ')':item.type"
                  :value="item.type">
                </el-option>
              </el-select>
              <el-input v-model="dictForm.type" :disabled="this.dialogType === 'edit'" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级字典" prop="parentCode">
              <el-select style="width: 100%" v-model="dictForm.parentCode">
                <el-option
                  v-for="item in parentDictList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="字典编码" prop="code">
              <el-input v-model="dictForm.code" :disabled="this.dialogType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="dictForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序值" prop="sort">
              <el-input type="number" v-model="dictForm.sort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="enable" v-if="dialogType==='edit'">
              <el-radio-group v-model="dictForm.enable">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="编辑状态" prop="editable" v-else>
              <el-radio-group v-model="dictForm.editable">
                <el-radio :label="0">不可编辑</el-radio>
                <el-radio :label="1">可编辑</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="dictForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button :disabled="dictForm.editable === 0 && dialogType === 'edit'" type="primary" @click="save">确定</el-button>
          <el-button @click.native="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="维护字典类型" :visible.sync="editDictTypeVisible" width="50%">
      <el-table :data="dictTypeList" border stripe height="320">
        <el-table-column prop="type" label="字典类型" align="center">
          <template slot-scope="scope">
            <span v-if="edited !== scope.$index">{{scope.row.type}}</span>
            <el-input v-model="scope.row.type" v-else></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="字典类型名称" align="center">
          <template slot-scope="scope">
            <span v-if="edited !== scope.$index">{{scope.row.typeName}}</span>
            <el-input v-model="scope.row.typeName" v-else></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="子级字典编码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button v-show="edited !== scope.$index" size="mini" type="primary" @click="editDictType(scope)">编辑</el-button>
            <el-button v-show="edited === scope.$index" size="mini" type="primary" @click="saveDictType(scope)">保存</el-button>
            <el-button v-show="edited === scope.$index" size="mini" @click.native="edited = false">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {fetchDictListByPage, fetchDictType, fetchDictByType, updateDict, updateDictType, createDict, deleteDict} from '@/api/dict'
import pagination from '@/components/Pagination'
import {deepClone} from "@/utils";

const defaultDictForm = {
  id: '',
  type:'',
  code:'',
  name: '',
  parentType:'',
  parentCode:'',
  remark:'',
  editable:1,
  enable:''
}

export default {
  name: 'dict',
  components:{
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      dialogType: 'new',
      dictForm: Object.assign({},defaultDictForm),
      rules: {
        type: [{required: true, message: '请选择字典类型', trigger: 'blur'},],
        code: [{required: true, message: '请输入字典编码', trigger: 'blur'},],
        name: [
          {required: true, message: '请输入字典名称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序值', trigger: 'blur'},
        ]

      },
      list: [],
      listLoading: true,
      total:0,
      listQuery: {
        type:'',
        typeName:'',
        code: '',
        page: 1,
        limit: 10,
      },
      dictTypeList:[],
      parentDictList:[],
      editDictTypeVisible:false,
      edited: null, //标识是否处于编辑状态
      inputType:'select'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
    this.getDictTypeList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDictListByPage(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    getDictTypeList(){
      fetchDictType().then(resp => {
        this.dictTypeList = resp.data.data
        // console.log(resp.data.data)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.type = ''
      this.listQuery.typeName = ''
      this.listQuery.code = ''
      this.listQuery.page = 1
      this.getList()
    },
    add() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.dictForm = Object.assign({}, defaultDictForm)

      this.inputType = 'select'

      console.log(this.dialogType,this.dictForm)
      // 清空表单验证
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    // 更改表头样式
    tableHeaderColor({ rowIndex}){
      if (rowIndex === 0) {
        return 'background-color: #FAFAFA;color: #666;'
      }
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.dictForm = deepClone(scope.row)
      this.inputType = ''
      this.getDictByType(this.dictForm.parentType)
    },
    handleDel({$index,row}) {
      this.$confirm('确定删除字典吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteDict({dictId:row.id})
        if (resp.data.code === 200){
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        }
      }).catch(err => console.log(err))
    },
    getDictByType(type){
      fetchDictByType({type:type}).then(resp => {
        this.parentDictList = resp.data.data
        // console.log(this.parentDictList)
      })
    },
    changeInputType(val){
      this.inputType = val
    },
    save() {
      const isEdit = this.dialogType === 'edit'

      this.$refs['form'].validate((valid) => {
        if (valid) {

          if (!isEdit){
            createDict(this.dictForm).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.dialogVisible = false
                this.getList()
              }
            })
          }else {
            updateDict(this.dictForm).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.getList()
                this.dialogVisible = false
              }
            })
          }
        }
      })
    },
    editDictType(scope){
      this.edited = true
      this.edited = scope.$index
    },
    saveDictType(scope){
      this.edited = false

      let dictType = deepClone(scope.row)
      if (dictType.ids){
        dictType.ids = dictType.ids.split(',')
      }

      this.editDictTypeVisible = false
      updateDictType(dictType).then(resp => {
        if (resp.data.code === 200){
          this.$message.success(resp.data.msg)
        }
        this.getList()
        this.getDictTypeList()
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  margin-top: 10px;
  margin-left: 10px;
}
.block{
  padding: 15px 10px;
}
.app-container-content{
  margin-top: 10px;
  border: 1px solid #d8dce5;
}
//.data-table{
//  width: 100%;
//}
</style>
