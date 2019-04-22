<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>

      <!--tree型table表格展示区-->
      <zk-table
        :data="catInfos"
        :columns="catInfosColumns"
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>

      <!--添加分类的Dialog对话框-->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <el-cascader
              expand-trigger="hover"
              :options="catInfosTwo"
              :props="catInfosProps"
              v-model="selectedCat"
              @change="handleChange"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getCatInfos()
  },
  methods: {
    /** 添加分类相关1 */
    // 级联选择器 的内容变化后的回调
    handleChange() {
      // 通过"selectedCat"获得当前分类选取的上级分类信息
      // selectedCat通过数组形式体现所选取的上级分类id信息
      // console.log(this.selectedCat)
      // [] 没有选取分类
      // [102]  选取了1级别分类
      // [103,115] 选取了2级别分类

      // 获取直接分类上级
      if (this.selectedCat.length === 0) {
        // 没有选取上级，本身作为级别分类添加
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        // 选取了1或2级别分类
        var len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 展示添加分类的对话框逻辑
    async showAddDialog() {
      // 展示对话框
      this.addDialogVisible = true

      // 获得"级联选择器"(第1/2级别分类)需要的数据
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好的信息赋予给 catInfosTwo
      this.catInfosTwo = res.data
    },
    // 关闭对话框重置form表单
    addDialogClose() {
      // 只重置form表单
      this.$refs.addFormRef.resetFields()
      // 上级分类 级联选取器 也需要重置
      this.selectedCat = []
    },
    // 收集数据存储
    addCat() {
      // 表单校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // cat_pid父级 / cat_name分类名称 / cat_level分类级别
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭对话框、成功提示、重新加载数据
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getCatInfos()
        }
      })
    },
    /** 添加分类相关2 */
    // 获取用于显示的分类信息
    async getCatInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: this.queryParams.pagenum,
          pagesize: this.queryParams.pagesize
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好的分类信息赋予给 catInfos 成员
      this.catInfos = res.data.result
    }
  },
  data() {
    return {
      /** 添加分类相关1 */
      addDialogVisible: false,
      // 表单校验规则
      addFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 表单数据对象
      addForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 分类上级id
        cat_level: 0 // 分类的级别
      },
      // 级联选择器相关成员
      catInfosTwo: [], // 第1/2级别分类信息(供选取使用)
      selectedCat: [], // 设定分类 后的接收变量
      // 给各个节点定义：名称、值、子级
      catInfosProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      /** 添加分类相关2 */

      // 定义获取用户数据时用到的查询条件参数
      queryParams: {
        pagenum: 1, // 当前页码
        pagesize: 5, // 每页显示条数
        total: 0 // 记录总条数
      },
      // 接收获得回来的分类列表信息
      catInfos: [],
      // 给表格设置数据属性
      catInfosColumns: [
        // 设置各个列的属性值
        // 语法：{label: '表格标题头信息',prop: '显示内容对应的字段',}
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
