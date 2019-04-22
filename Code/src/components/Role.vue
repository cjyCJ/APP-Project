<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <!--添加按钮展示区-->
      <el-button type="primary">添加角色</el-button>

      <!--数据表格展示区域-->
      <el-table :data="roleInfos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!--遍历1级权限-->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #EBEEF5','border-top':k===0?'1px solid #EBEEF5':''}"
            >
              <el-col :span="5">
                <!--closable：设定显示关闭按钮-->
                <!--i标签：显示右方向箭头图标-->
                <el-tag closable @close="closeTag(info.row.id, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--遍历二级权限-->
                <el-row
                  v-for="(item2,kk) in item.children"
                  :key="item2.id"
                  :style="{'border-top':kk!==0 ? '1px solid #EBEEF5' : ''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(info.row.id, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--遍历三级权限-->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeTag(info.row.id, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="info">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分配权限的Dialog对话框-->
      <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
        <el-form ref="distributeFormRef" :model="distributeForm" label-width="120px">
          <el-form-item label="角色名称：">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="供分配权限：">
            <el-tree
              :data="rightsInfo"
              :props="rightsInfoProps"
              node-key="id"
              show-checkbox
              default-expand-all
              :default-checked-keys="deFaultCheckedKeys"
              ref="rightsTree"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributeRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    // 获取角色数据
    this.getRoleInfos()
  },
  methods: {
    /** 分配权限相关1 */
    // 给角色分配权限
    async distributeRights() {
      // 获得"全选"的节点的id信息，数组返回
      var ids1 = this.$refs.rightsTree.getCheckedKeys()
      // 获得"半选"节点的id信息，数组返回
      var ids2 = this.$refs.rightsTree.getHalfCheckedKeys()

      // console.log(ids1)  //  [10,13,15]
      // console.log(ids2)  //  [5,7]

      // 把 全选 和 半选 的权限id合并到一起并变为"逗号分隔"的字符串
      var allIds = [...ids1, ...ids2].join(',')
      // console.log(allIds)  // 116,117,101,104

      // 没有选取权限的处理
      if (!allIds) {
        return this.$message.error('请选取权限')
      }

      // 通过axios提交存储分配的权限信息
      const { data: res } = await this.$http.post(
        'roles/' + this.distributeForm.id + '/rights',
        { rids: allIds }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 关闭对话框、成功提示、重新加载角色信息
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfos()
    },
    // 展示分配权限对话框
    // 参数role: 当前被分配权限的角色记录(包括id、roleName、roleDesc还有对应的children权限等)
    async showDistributeDialog(role) {
      this.distributeDialogVisible = true
      // 把role 赋予 给distributeForm表单数据对象
      this.distributeForm = role

      // 把用户分配的权限数据获得出来
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好权限数据 赋予 给data成员rightsInfo
      this.rightsInfo = res.data

      // 从role中，把当前角色拥有的权限(3级别权限)的id获得出来
      // 具体要通过"递归遍历"的方式把拥有的3级别权限id都获得出来
      var idArr = [] // 临时接收拥有的权限id，把各个id汇总到【数组】中
      this.getHaveRights(role, idArr)
      // idArr就是当前角色拥有的权限集合的数组 [101,107,120,133...]
      // console.log(idArr)  // [109, 154, 155, 148]
      // 把idArr 赋予给 deFaultCheckedKeys
      this.deFaultCheckedKeys = idArr
    },
    // 从一个角色(node)中把拥有的"叶子节点"权限的id汇总出来给到keys
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        this.getHaveRights(item, keys)
      })
    },

    /** 分配权限相关2 */

    // 给角色移除指定的权限
    closeTag(roleId, rightsId) {
      // 确认操作
      this.$confirm('确认要删除该权限么?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(
            'roles/' + roleId + '/rights/' + rightsId
          )

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 提示操作成功信息、重新加载角色数据
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },
    // 获得 角色列表数据
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 把获得好的角色数据 赋予 给roleInfos成员
      this.roleInfos = res.data
    }
  },
  data() {
    return {
      /** 分配权限相关1 */
      distributeDialogVisible: false, // 对话框展示开关
      // 表单数据对象
      distributeForm: {
        id: 0, // 当前被分配权限的角色id，供后期使用
        roleName: '' // 当前被分配权限的角色名称
      },
      rightsInfo: [], // 接收用于分配的权限信息
      rightsInfoProps: {
        // 给 大树 设置数据属性
        // 语法：名称:  数据字段名称
        label: 'authName', // 树节点标签名称通过authName呈现
        children: 'children' // 上下级节点通过children衔接
      },
      deFaultCheckedKeys: [], // 默认 树节点选中 数据
      /** 分配权限相关2 */

      // 接收角色列表数据
      roleInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
