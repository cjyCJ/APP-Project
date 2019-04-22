<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
            @clear="getGoodsInfos"
            @keyup.enter.native="getGoodsInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--数据列表表格展示区域-->
      <el-table :data="goodsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="140"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="130"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>

        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getGoodsInfos()
  },
  methods: {
    /** 添加商品相关1 */
    goAddPage() {
      // 重定向到goodsadd的路由去
      this.$router.push('goodsadd')
    },
    /** 添加商品相关2 */

    // 数据分页相关1
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      // val:代表变化后的每页信息显示条数
      this.queryParams.pagesize = val
      // 根据变化后的 显示条数 重新获得数据
      this.getGoodsInfos()
    },
    // 当前页码变化回调处理
    handleCurrentChange(val) {
      // val:代表变化后的 页码
      this.queryParams.pagenum = val
      // 根据变化后的 页码 重新获得数据
      this.getGoodsInfos()
    },
    // 数据分页相关2

    // 获得首屏商品数据
    async getGoodsInfos() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams
      })

      // 获取数据失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 丰富记录总条数变量
      this.queryParams.total = res.data.total
      // 把获得的商品数据 赋予给goodsInfos成员
      this.goodsInfos = res.data.goods
    }
  },
  data() {
    return {
      // 接收商品数据
      goodsInfos: [],
      // 定义获取商品数据时用到的查询条件参数
      queryParams: {
        query: '', // 商品关键字搜索使用
        pagenum: 1, // 当前页码
        pagesize: 5, // 每页显示条数
        total: 0 // 记录总条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
