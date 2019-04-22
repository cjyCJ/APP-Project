<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>留言管理</el-breadcrumb-item>
      <el-breadcrumb-item>留言列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">批量删除</el-button>
        </el-col>
      </el-row>

      <!--数据列表表格展示区域-->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="selection" :label="全选"  width="55" ></el-table-column>
        <el-table-column prop="username" label="姓名" width="140" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" align="center"></el-table-column>
        <el-table-column prop="role_name" label="留言" align="center"></el-table-column>
        <!-- <el-table-column label="状态" width="70">
        <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>-->
        <!--在此获得每个用户的信息，用户信息已经被插槽传递到此位置了，请自动接收即可
              每个用户数据具体是通过"row"关键字定义的
        -->
        <!-- <span slot-scope="info">{{info.row}}</span> -->
        <!-- </el-table-column> -->

        <el-table-column label="操作" width="150">
          <template slot-scope="info">
            <el-tooltip content="查看留言" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除留言" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(info.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--数据分页展示区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>

      <!--添加用户的Dialog弹框区-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户的Dialog弹框区-->
      <el-dialog
        title="访客信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="性别" >
             <el-radio-group v-model="editForm.gender">
               <el-radio label="先生"></el-radio>
               <el-radio label="女士"></el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="email">
            <el-input v-model="editForm.email" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="留言">
            <el-input type="textarea" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="回复">
            <el-input type="textarea" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--分配角色的Dialog弹框区-->
      <el-dialog
        title="分配角色"
        :visible.sync="fenpeiDialogVisible"
        width="50%"
        @close="fenpeiDialogClose"
      >
        <el-form
          :rules="fenpeiFormRules"
          ref="fenpeiFormRef"
          :model="fenpeiForm"
          label-width="130px"
        >
          <el-form-item label="当前的用户" prop="username">{{fenpeiForm.username}}</el-form-item>
          <el-form-item label="分配角色" prop="rid">
            <el-select v-model="fenpeiForm.rid" placeholder="请选择">
              <el-option
                v-for="item in roleInfos"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpeiDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getUserInfos()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedUsers = val ? this.checkedId : []
      this.isIndeterminate = false
    },
    handleCheckedUsersChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkedId.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkedId.length
    },
    /** 分配角色相关1 */
    // 关闭对话框重置form表单
    fenpeiDialogClose() {
      this.$refs.fenpeiFormRef.resetFields()
    },
    // 分配动作实现
    async fenpeiRole() {
      const { data: res } = await this.$http.put(
        'users/' + this.fenpeiForm.id + '/role',
        this.fenpeiForm
      )

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 分配角色成功：关闭对话框、提示成功消息、页面数据重新加载
      this.fenpeiDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getUserInfos()
    },
    // 展示分配角色的对话框
    async showFenpeiDialog(id) {
      // 打开对话框
      this.fenpeiDialogVisible = true

      // 查询当前被分配角色的用户信息
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 把获得的用户信息 赋予 给fenpeiForm 表单数据对象
      this.fenpeiForm = res.data
      console.log(this.fenpeiForm)
      // 此时的 fenpeiForm 表单数据对象内部有如下5个信息
      // "id": 503,
      // "username": "admin3",
      // "rid": 0,
      // "mobile": "00000",
      // "email": "new@new.com"

      // 把用于分配的角色信息查询出来
      const { data: res2 } = await this.$http.get('roles')
      if (res2.meta.status !== 200) {
        return this.$message.error(res2.meta.msg)
      }
      // 把获得好的角色信息赋予给成员
      this.roleInfos = res2.data
    },
    /** 分配角色相关2 */

    // 修改用户相关1
    // 展示修改用户的Dialog
    // @param id: 被修改用户id
    async showEditDialog(id) {
      this.editDialogVisible = true
      // 把被修改用户的信息展示到form表单中
      // 根据id查询被修改用户信息
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 接收被修改用户信息
      this.editForm = res.data
    },
    // dialog对话框 关闭 要进行form表单重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 接收信息入库存储
    editUser() {
      // 校验表单,没有问题axios再向api接口发起请求
      this.$refs.editFormRef.validate(async valid => {
        // 校验成功
        if (valid) {
          // axios提交数据存储
          // 用户id 已经被存储赋予给editForm.id成员里边了
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 修改用户信息完毕(关闭Dialog、成功提示、更新列表数据)
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 修改用户相关2
    // 删除用户
    delUser(id) {
      // 确认操作
      this.$confirm('确定要删除该会员么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios 触发api接口删除
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 删除成功:提示 和 更新数据
          this.$message.success(res.meta.msg)

          // 判断数据删除之前，当前页码只有一条数据
          if (this.userInfos.length === 1 && this.queryParams.pagenum > 1) {
            // 使得页码减1操作
            this.queryParams.pagenum--
          }
          // 重新加载数据
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 添加用户相关1
    // 收集用户信息存储到后端api的数据库中
    addUser() {
      // 进行客户端form表单校验
      this.$refs.addFormRef.validate(async valid => {
        // 校验成功的处理
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)

          // 提交不成功处理
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          // 关闭Dialog、提示成功信息、及时把新添加用户刷新出来
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 重置form表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户相关2

    // 数据分页相关1
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      // val:代表变化后的每页信息显示条数
      this.queryParams.pagesize = val
      // 根据变化后的 显示条数 重新获得数据
      this.getUserInfos()
    },
    // 当前页码变化回调处理
    handleCurrentChange(val) {
      // val:代表变化后的 页码
      this.queryParams.pagenum = val
      // 根据变化后的 页码 重新获得数据
      this.getUserInfos()
    },
    // 数据分页相关2

    // 获得首屏用户数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })

      // 获取数据失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 丰富记录总条数变量
      this.queryParams.total = res.data.total
      // 把获得的用户数据 赋予给userInfos成员
      this.userInfos = res.data.users
    }
  },
  data() {
    // 自定义校验器
    // var checkMobile = (rule, value被校验数据, callback回调函数)=>{}
    var checkMobile = (rule, value, callback) => {
      // 校验手机号码规则：13/5/7/8后接9位数字(一共11位)
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败
        return callback(new Error('手机号码格式不正确'))
      }

      // 校验通过
      callback() // 继续执行
    }
    return {
      /** 分配角色相关1 */
      // 对话框是否显示标志
      fenpeiDialogVisible: false,
      // 可用于分配的角色列表信息
      roleInfos: [],
      // 表单数据对象
      fenpeiForm: {
        username: '',
        rid: ''
      },
      // 表单校验规则
      fenpeiFormRules: {
        rid: [{ required: true, message: '角色必须选择', trigger: 'change' }]
      },
      /** 分配角色相关2 */

      // 修改用户相关1
      // Dialog弹框是否显示 true:显示  false:隐藏
      editDialogVisible: false,
      // form表单数据部分
      editForm: {
        username: '',
        email: '',
        mobile: '',
        gender:''
      },
      // form表单校验规则制作
      editFormRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // { validator: 自定义校验器, trigger: 'blur' }
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户相关2

      // 添加用户相关1
      // Dialog弹框是否显示 true:显示  false:隐藏
      addDialogVisible: false,
      // form表单数据部分
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form表单校验规则制作
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // { validator: 自定义校验器, trigger: 'blur' }
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加用户相关2

      // 接收用户数据
      userInfos: [],
      // 定义获取用户数据时用到的查询条件参数
      queryParams: {
        query: '', // 用户关键字搜索使用
        pagenum: 1, // 当前页码
        pagesize: 3, // 每页显示条数
        total: 0 // 记录总条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
