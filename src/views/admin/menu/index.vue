<template>
  <div class="app-container">
    <el-button type="primary" class="add-button" size="small" @click="handleAdd">新增</el-button>

    <el-table :data="list"
              row-key="id"
              class="table"
              v-loading="listLoading"
              height="calc(100vh - 255px)"
              border
              :tree-props="{children: 'children'}">
      <el-table-column
        align="left"
        label="菜单名称"
        fixed
        show-overflow-tooltip
        min-width="150">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="图标"
        min-width="120">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单类型" min-width="115">
        <template slot-scope="scope">
          <el-tag :type="getTagsType(scope.row.type)">
            {{ scope.row.type | getMenuType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由名称" min-width="115">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由路径" min-width="115" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限字段" min-width="115">
        <template slot-scope="scope">
          {{ scope.row.perms }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由组件" min-width="115">
        <template slot-scope="scope">
          {{ scope.row.component }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="重定向" min-width="115">
        <template slot-scope="scope">
          {{ scope.row.redirect }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否隐藏" min-width="115">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.hidden === 1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-has="'sys:menu:edit'" class="el-icon-edit" type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button class="el-icon-delete" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新增菜单'">
      <el-form :model="menu" :rules="rules" ref="form" label-width="80px" label-position="right">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group @change="menuTypeChange" v-model="menu.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级菜单" prop="pidName">
              <el-input v-model="menu.pidName" @focus="openMenuTree" placeholder="请选择上级菜单"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-form-item label="菜单名称" prop="title">
            <el-input v-model="menu.title" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="menu.type !== 2">
          <el-col :span="11" v-if="menu.type !== 2">
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="menu.name" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-form-item label="路由组件" prop="component">
              <el-input v-model="menu.component" placeholder="请输入路由组件" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="权限字段" prop="perms">
              <el-input v-model="menu.perms" placeholder="请输入权限字段" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1" v-if="menu.type !== 2">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menu.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="menu.type !== 2">
          <el-col :span="11" v-if="menu.type !== 2">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="menu.icon" placeholder="请输入图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="1">
          <el-form-item label="重定向" prop="redirect">
            <el-input v-model="menu.redirect" placeholder="是否重定向" />
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否隐藏" prop="hidden">
              <el-radio-group v-model="menu.hidden" :disabled="menu.type === 2">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleMenu" title="选择上级菜单" width="25%">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-tree
              ref="menuType"
              node-key="id"
              :data="showMenuTree"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :auto-expand-parent="false">
            </el-tree>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleMenu=false">取消</el-button>
        <el-button type="primary" @click="saveMenuType">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {fetchMenus,createMenu,deleteMenu,updateMenu,fetchMenu} from "@/api/admin/menu";
import {deepClone} from "@/utils";
import {deleteRole} from "@/api/admin/role";
import store from "@/store";
import router from "@/router";

const defaultMenu = {
  id: '',
  pid: '',
  pidName:'',
  path: '',
  component:'',
  redirect:'',
  name:'',
  title: '',
  icon:'',
  hidden:1,
  type: 0,
  perms:''
}
export default {
  name: "index",
  computed:{

  },
  created() {
    this.getList()
    // console.log(this.menuTree)
  },
  data(){
    return {
      list:[],
      allMenu:[],
      menu:Object.assign({},defaultMenu),
      rules:{
        type: [
          { required:'true',message:'请输入菜单类型', trigger: 'blur' }
        ],
        pidName: [
          { required:'true',message:'请选择上级菜单', trigger: 'change' }
        ],
        title: [
          { required:'true',message:'请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required:'true',message:'请输入路由路径', trigger: 'blur' }
        ],
        perms: [
          { required:'true',message:'请输入权限字段', trigger: 'blur' }
        ],
        component:[{ required:'true',message:'请输入路由组件', trigger: 'blur' }],
        name:[{ required:'true',message:'请输入路由名称', trigger: 'blur' }],
      },
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      dialogVisibleMenu: false,
      menuTree: [],
      showMenuTree:[],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchMenus().then(resp => {
        if (resp.data.code === 200){
          this.list = resp.data.data
          this.allMenu = deepClone(resp.data.data)
          this.menuTree = [{id:0,pid:-1,title:'顶级菜单',children:deepClone(this.allMenu)}]
        }
        // console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
    },
    handleAdd(){
      this.menu = Object.assign({}, defaultMenu)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.menuTypeChange(this.menu.type)
    },
    saveMenuType(){
     this.dialogVisibleMenu = false

      let currentNode = this.$refs.menuType.getCurrentNode()
      this.menu.pid = currentNode.id
      this.menu.pidName = currentNode.title
    },
    // tags类型
    getTagsType(val){
      let status = '';
      switch (val) {
        case 0:
          status = ''
          break;
        case 1:
          status = 'success'
          break;
        case 2:
          status = 'danger'
          break;
      }
      return status
    },
    async handleEdit(scope){
      this.menuTypeChange(scope.row.type)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
      let pidName
      if (scope.row.pid === 0){
        pidName = '顶级菜单'
      }else {
        let resp = await fetchMenu({id:scope.row.pid})
        pidName = resp.data.data.title
      }

      this.menu = deepClone(scope.row)
      this.menu.pidName = pidName
    },
    handleDelete({ $index, row }){
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteMenu({id:row.id})
        if (resp.data.code === 200){
          this.$message({
              type: 'success',
              message: resp.data.msg
            })
          this.getList()
        }
        await this.$store.dispatch('user/changeMenu', this.$route.path)
      }).catch(err => { console.error(err) })
    },
    menuTypeChange(val){
      let showMenuTree = deepClone(this.menuTree)
      this.recursionMenu(showMenuTree,val - 1)
      this.showMenuTree = showMenuTree
      // console.log(this.showMenuTree)
    },
    recursionMenu(menuTree,type){
      return menuTree.filter(item => {
        // console.log(item.pid,type,typeof item.pid, item.pid === type,typeof type)

        if (item.children && item.children.length > 0){
          item.children = this.recursionMenu(item.children,type)
        }

        if (type === -1 || type === 0){
          return item.pid === type;
        }else{
          return true
        }
      })
    },
    openMenuTree(){
      this.dialogVisibleMenu = true

      // this.$nextTick(() => {
      //   this.$refs.menuType.setCurrentKey(this.menu.id)
      //
      //   console.log(this.$refs.menuType.getCurrentNode(),this.$refs.menuType.getCurrentKey())
      // })
    },
    save(){
      const isEdit = this.dialogType === 'edit'

      this.$refs['form'].validate((valid) => {
        if (valid){
          this.dialogVisible = false

          console.log(this.menu)
          if (!isEdit){
            createMenu(this.menu).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.getList()
                this.$store.dispatch('user/changeMenu', this.$route.path)
              }
            })
          }else{
            updateMenu(this.menu).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.getList()
                this.$store.dispatch('user/changeMenu', this.$route.path)
              }
            })
          }
        }
      })


    },
  }
}
</script>

<style scoped>
.app-container{
  margin-top: 10px;
  margin-left: 10px;
}
.add-button{
  margin-top: 10px;
}
.table{
  width: 100%;
  margin-top: 21px;
}
</style>
