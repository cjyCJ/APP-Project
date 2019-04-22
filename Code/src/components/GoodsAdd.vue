<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!--步骤条-需要通过0/1/2..(number数值型信息)下标进行激活的，-->
      <el-steps :active="activeStep-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--标签切换-通过name的属性值(string字符串型信息)激活选中-->
      <!--标签切换 与 步骤条联动：标签切换 起主导作用-->
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-tabs v-model="activeStep" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="uploadParams"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
          </el-tab-pane>
          <el-button type="primary" style="margin-top:20px;" @click="addGoods">添 加</el-button>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入编辑器css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入编辑器模块
import { quillEditor } from 'vue-quill-editor'

export default {
  // 私有化注册编辑器组件模块
  components: {
    quillEditor
  },
  methods: {
    // 添加商品-收集数据存储
    async addGoods() {
      // console.log(this.addForm)
      const { data: res } = await this.$http.post('goods', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      // 添加成功：显示成功提示、重定向到商品列表页中
      this.$message.success(res.meta.msg)
      this.$router.push('goods')
    },
    // 图片上传成功的回调处理
    // 通过result可以接受上传好的图片信息，及相关其他结果
    uploadSuccess(result) {
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 上传成功：把上传好的图片的tmp_path临时路径名 赋予 给 addForm.pics成员中去
      var obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
    }
  },
  data() {
    return {
      /** 图片上传相关1 */
      // 图片上传 服务器端api地址设置
      uploadUrl: 'http://127.0.0.1:8765/api/private/v1/upload',
      // 图片上传 请求头token信息设定
      uploadParams: {
        Authorization: window.sessionStorage.getItem('token')
      },
      /** 图片上传相关2 */

      // 激活步骤条
      activeStep: '0',
      /** 添加商品相关1 */
      // 表单数据对象
      addForm: {
        goods_name: '',
        goods_cat: '1,2,3', // 模拟假数据
        goods_weight: '',
        goods_number: '',
        goods_price: '',
        pics: [],
        goods_introduce: ''
      }
      /** 添加商品相关2 */
    }
  }
}
</script>
<style lang="less" scoped>
// 给步骤条设置样式
.el-steps {
  margin-top: 20px;
}
// 给切换标签设置样式
.el-tabs {
  margin-top: 20px;
}
</style>
