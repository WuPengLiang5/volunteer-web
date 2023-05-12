<template>
  <div class="app-container">
    <el-button type="primary" class="add-button" size="small" @click="handleAddRole" v-has="'sys:role:add'">新建角色</el-button>

    <el-table :data="rolesList" class="roles-table"  border>
      <el-table-column align="center" label="ID" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色中文名称" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.nameZh }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.state === '1'?'使用':'禁用'" placement="top">
            <el-switch
              v-model="scope.row.state"
              :disabled="scope.row.isSys === '1'"
              :active-value="1"
              :inactive-value="0"
              @change="changeSwitch(scope.row, $event, scope.$index)">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="290">
        <template slot-scope="scope">
          <el-button type="primary" class="el-icon-edit" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button :disabled="scope.row.isSys === '1'" type="primary" class="el-icon-setting" size="small" @click="handleEditPerm(scope)">分配权限</el-button>
          <el-button :disabled="scope.row.isSys === '1'" type="danger" class="el-icon-delete" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoles" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleEditPerm" title="编辑权限">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="权限表">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="allMenu"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleEditPerm=false">取消</el-button>
        <el-button type="primary" @click="confirmRolePerm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import {fetchRoleList, createRole, deleteRole, updateRole} from "@/api/role"
import pagination from '@/components/Pagination'
import qs from 'qs'

const defaultRole = {
  id: '',
  name: '',
  nameZh:'',
  description: '',
  menus: [],
  state: "1"
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisibleEditPerm:false
    }
  },
  components:{
    pagination
  },
  computed: {
    allMenu(){
      return this.$store.getters.allMenu
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      let resp = await fetchRoleList(this.listQuery)

      if (resp.data.code === 200){
        this.rolesList = resp.data.data
        this.total = resp.data.total
      }
    },
    checkRole(id){
      return id === 1
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    changeSwitch(role, state, index){
      updateRole(role).then(resp => {
        if (resp.data.code === 200){
          this.$message({
            type:'success',
            message:'状态修改成功'
          })
        }else{
          role.state = role.state === '1' ? '0':'1'
          this.rolesList[index] = role
        }
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      console.log(scope.row)
      this.role = deepClone(scope.row)
    },
    handleEditPerm(scope){
      this.dialogVisibleEditPerm = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const menus = this.generateArr(this.role.menus)
        this.$refs.tree.setCheckedNodes(menus)
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除角色吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await deleteRole(qs.stringify({
            roleId:row.id
          })).then(resp => {
            if (resp.data.code === 200){
              this.rolesList.splice($index, 1)
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
              this.getRoles()
            }
          })
        }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      let roleMenu = deepClone(this.role)
      console.log(roleMenu)
      this.dialogVisible = false

      if (isEdit) {
        console.log("更新角色")
        await updateRole(roleMenu).then(resp => {
          if (resp.data.code === 200){
            this.$message.success(resp.data.msg)
          }
        })
        await this.getRoles()
      } else {
        await createRole(roleMenu).then(resp => {
          if (resp.data.code === 200){
            this.$message.success(resp.data.msg)
          }
        })
        await this.getRoles()
      }
    },
    async confirmRolePerm(){
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const keys = [].concat(checkedKeys,halfCheckedKeys)

      let roleMenu = deepClone(this.role)
      roleMenu.menuIds = keys

      this.dialogVisibleEditPerm = false
      await updateRole(roleMenu).then(resp => {
        if (resp.data.code === 200){
          this.$message.success(resp.data.msg)
        }
      })
      await this.getRoles()
      await this.$store.dispatch('user/changeMenu', this.$route.path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  margin-top: 10px;
  margin-left: 10px;

  .add-button{
    margin-top: 10px;
  }
  .roles-table {
    width: 100%;
    margin-top: 21px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
