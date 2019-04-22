<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--内容卡片区-->
    <el-card class="box-card">
      <!--警告区-->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!--商品分类 级联选取器-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfos"
            :props="catInfosProps"
            v-model="selectedCat"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!--标签切换区-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <!--数据列表表格展示区域-->
          <el-table :data="manyParamInfos" border style="width: 100%">
            <el-table-column type="expand">
              <!--获得到每条“参数”记录信息-->
              <template slot-scope="info">
                <!--展示参数 可选值-->
                <el-tag
                  v-for="v in info.row.attr_vals_arr"
                  :key="v+Math.random()"
                  closable
                  disable-transitions
                >{{v}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="340">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <!--数据列表表格展示区域-->
          <el-table :data="onlyParamInfos" border style="width: 100%">
            <el-table-column type="expand">
              <!--获得到每条“参数”记录信息-->
              <template slot-scope="info">
                <!--展示参数 可选值-->
                <el-tag
                  v-for="v in info.row.attr_vals_arr"
                  :key="v+Math.random()"
                  closable
                  disable-transitions
                >{{v}}</el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="340">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
    /** 添加 参数可选值 按钮/输入框 部分1 */
    // 添加 参数可选值 的输入框 的回车和失去焦点事件 的回调处理
    // nowParam:当前被处理的参数
    handleInputConfirm(nowParam) {
      // 1.把用户输入的信息显示到页面上(要给nowParam.attr_vals_arr增加元素而已)
      if (this.inputValue.trim() !== '') {
        nowParam.attr_vals_arr.push(this.inputValue.trim())
      }
      // 2.input隐藏、button显示
      this.inputVisible = false
      // 3.input框的内容被清除
      this.inputValue = ''
    },
    // 添加 参数可选值 按钮被点击后触发回调
    showInput() {
      // 显示input，隐藏button
      this.inputVisible = true
      // 给显示的input框设置获得焦点效果
      // $nextTick: 表示页面全部内容已经通过vue"渲染"完毕
      // (那么给页面input框设置focus事件就正合适)
      this.$nextTick(_ => {
        // 下述有调用了两次$refs,是固定语法
        // 表示要获得el-input组件内部的原始的input框元素
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /** 添加 参数可选值 按钮/输入框 部分2 */
    // 获得 3级别商品分类信息
    async getCatInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得好的分类信息赋予给 catInfos成员
      this.catInfos = res.data
    },
    // 商品分类 级联选择器 内容变化的回调
    handleChange() {
      // 选取了 非第3级别 分类
      if (this.selectedCat.length !== 3) {
        // 重置 级联选择器
        this.selectedCat = []
        // 禁用 添加参数的两个按钮
        this.showButton = true
        // 清空catThreeId成员
        this.catThreeId = 0
        // 清空已经获得到的参数信息
        this.manyParamInfos = []
        this.onlyParamInfos = []
      } else {
        // 解禁 添加参数的两个按钮(选取了 第3级别 分类)
        this.showButton = false
        // 把当前选取的第3级别分类的id赋予 给 catThreeId
        this.catThreeId = this.selectedCat[2]
        // 调用 方法 获得 相关分类参数信息
        this.getParamInfos()
      }
    },
    // 根据 第3级别分类id 和 tabs标签 两个条件获得对应的“分类参数”列表信息
    async getParamInfos() {
      const { data: res } = await this.$http.get(
        'categories/' + this.catThreeId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 把各个参数的可选值变型处理，由字符串变为数组(通过"空格"分割)
      // 遍历处理
      res.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      // console.log(res)

      // 通过具体data成员接收获得好的“分类参数”信息
      if (this.activeName === 'many') {
        this.manyParamInfos = res.data
      } else {
        this.onlyParamInfos = res.data
      }
    },
    // 切换标签被点击后的回调处理
    handleClick() {
      // 没有选取第3级别分类，就停止后续执行
      if (this.catThreeId === 0) {
        return null
      }

      // 条件：现在已经选取了第3级别分类(catThreeId的值不为0)
      // 调用 方法 获得 相关分类参数信息
      this.getParamInfos()
    }
  },
  data() {
    return {
      /** 添加 参数可选值 按钮/输入框 部分1 */
      // 按钮/输入框 显示 控制开关
      inputVisible: false,
      // 接收 输入框 输入的可选值信息
      inputValue: '',
      /** 添加 参数可选值 按钮/输入框 部分2 */

      // 标签切换相关
      activeName: 'many', // 设置 或 接收 选中标签项目的值
      /** 商品分类，级联选择器相关1 */
      catInfos: [], // 商品分类信息
      // 级联选择器 信息属性设置,给各个节点定义：名称、值、子级
      catInfosProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 级联选择器 选中的分类信息
      selectedCat: [],
      // 添加参数按钮是否禁用
      showButton: true,
      // 接收选取的第3级别分类id信息
      catThreeId: 0,
      manyParamInfos: [], // 接收 动态参数
      onlyParamInfos: [] // 接收 静态参数
      /** 商品分类，级联选择器相关2 */
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}

/*给参数可选值的el-tag设置样式*/
.el-tag {
  margin: 10px 5px;
}
// 给添加 参数可选值 的输入框设置样式
.input-new-tag {
  width: 100px;
}
</style>
