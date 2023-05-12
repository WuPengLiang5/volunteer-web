<template>
  <div class="app-container">
    <el-button type="primary" class="add-button" size="small" @click="handleAddAdmin">新建管理员</el-button>

    <el-table :data="list"
              class="admins-table"
              v-loading="listLoading"
              height="309px"
              border>
      <el-table-column align="center" label="序号" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" min-width="130">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="roleId" label="用户角色" min-width="120" :formatter="toRoleName">
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.roleId | getRoleName}}-->
<!--        </template>-->
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-has="'sys:user:edit'" type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button v-has="'sys:user:edit'" type="primary" size="small" @click="assignRole(scope)">分配角色</el-button>
          <el-button v-has="'sys:user:delete'" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑管理员':'创建管理员'">
      <el-form :model="admin" ref="postForm" :rules="rules" label-width="80px" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="admin.username" :disabled="dialogType==='edit'" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="admin.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="admin.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="admin.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="admin.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleAssignRole" title="分配角色">
      <el-form :model="admin" ref="postForm" :rules="rules" label-width="80px" class="form">
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="admin.roleId"
            placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.nameZh"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleAssignRole=false">取消</el-button>
        <el-button type="primary" @click="confirmAssignRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchAdminList, fetchAdmin, createAdmin, deleteAdmin, updateAdmin} from "@/api/admin"
import {fetchRoleList} from "@/api/role";
import pagination from '@/components/Pagination'
import {deepClone} from "@/utils";
import {validEmail, validPhone} from "@/utils/validate";

const defaultForm = {
  id:'',
  username:'',
  password:'',
  name:'',
  phone:'',
  email:'',
  roleId:''
}

export default {
  name: "list",
  components:{
    pagination
  },
  filters:{

  },
  data(){
    const validateUsername = (rule, value, callback) => {
      const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('用户名只能为6-20位字符数字下划线组成'))
      } else {
        callback()
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不能为空'))
      } else if (!validEmail(value)) {
        callback(new Error('邮箱格式错误！'))
      } else {
        callback()
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机不能为空'))
      } else if (!validPhone(value)) {
        callback(new Error('手机格式错误！'))
      } else {
        callback()
      }
    };
    return {
      admin:Object.assign({},defaultForm),
      list:[],
      roleList:[],
      dialogVisible: false,
      dialogType: 'new',
      total:0,
      listLoading: true,
      listQuery:{
        page:1,
        limit:10
      },
      rules:{
        username:[{required:true,validator:validateUsername,trigger:'blur'}],
        password:[{required:true,message:'密码不能为空',trigger:'blur'}],
        name:[{required:true,message:'真实姓名不能为空',trigger:'blur'}],
        phone: [{required:true,validator:validatePhone,trigger:'blur'}],
        email: [{required:true,validator:validateEmail,trigger:'blur'}],
        roleId:[{required:true,message:'请选择角色',trigger:'blur'}]
      },
      dialogVisibleAssignRole:false
    }
  },
  async created() {
    await this.getList()
  },
  methods:{
    async getList(){
      this.listLoading = true
      await fetchAdminList(this.listQuery).then(resp => {
        this.list = resp.data.data
        this.total = resp.data.total

        // console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 500)
      })
      await this.getRoleList()
    },
    checkRole(id){
      return id === 1
    },
    async getRoleList(){
      let resp = await fetchRoleList({page:1,limit:-1})
      if (resp.data.code === 200) {
        this.roleList = resp.data.data
      }
    },
    handleAddAdmin(){
      this.admin = Object.assign({}, defaultForm)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    toRoleName(row,column){
      let roleId = row[column.property]
      let roleName;
      this.roleList.some(item => {
        if (item.id === roleId){
          roleName = item.nameZh
          return true;
        }
      })
      return roleName
    },
    handleEdit(scope){
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.resetFields();
      }
      this.admin = deepClone(scope.row)
    },
    assignRole(scope){
      this.dialogVisibleAssignRole = true
      if (this.$refs.postForm !== undefined) {
        this.$refs.postForm.clearValidate();
      }
      this.admin = deepClone(scope.row)
      console.log(this.admin.roleId)

    },
    handleDelete({ $index, row }){
      this.$confirm('确定删除管理员吗?', '提示', {
        confirmButtonText: '确实',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let resp = await deleteAdmin({adminId:row.id})
        if (resp.data.code === 200){
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
          // this.getList()
        }
      }).catch(err => console.log(err))
    },
    async confirmRole() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'

          let admin = deepClone(this.admin)
          this.dialogVisible = false

          if (isEdit) {
            updateAdmin(admin).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.getList()
              }
            })
          } else {
            createAdmin(admin).then(resp => {
              if (resp.data.code === 200){
                this.$message.success(resp.data.msg)
                this.getList()
              }
            })
          }
        }
      })
    },
    async confirmAssignRole(){
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateAdmin(this.admin).then(resp => {
            if (resp.data.code === 200){
              this.dialogVisibleAssignRole = false
              this.$message.success(resp.data.msg)
              this.getList()
              this.$store.dispatch('user/changeMenu', this.$route.path)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  //height: 326px;
  margin-top: 10px;
  margin-left: 10px;

  .add-button{
    margin-top: 10px;
  }
  .admins-table {
    width: 100%;
    margin-top: 21px;
  }
  .form{
    margin:0 65px 25px 60px;
  }
}
</style>
