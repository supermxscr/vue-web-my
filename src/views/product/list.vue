<template>
  <div class="page">
    <h3>{{ $t('route.product') }}</h3>
    <div>
      <el-button
        type="primary"
        @click="actions('add')"
      >{{ $t('table.add') }}</el-button>
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('product.titleAlert')"
        prefix-icon="el-icon-search"
        clearable
        class="inputWidth"
        @blur="getList('GET', 'product', listQuery)"
      />
      <el-select
        v-model="listQuery.categoryId"
        clearable
        :placeholder="$t('product.classifyAlert')"
        @change="getList('GET', 'product', listQuery)"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        clearable
        :placeholder="$t('product.statusAlert')"
        @change="getList('GET', 'product', listQuery)"
      >
        <el-option
          v-for="item in productStatus"
          :key="item.status"
          :label="item.name"
          :value="item.status"
        />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listData"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="40"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.title')"
        align="center"
      >
        <template slot-scope="{row}">
          <img
            :src="row.listImg"
            class="img"
          >
          <span class="titleInfo">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.title')"
        align="center"
      >
        <template slot-scope="{row}">
          <el-table
            min-width="60px"
            fit
            :data="row.productSkuList"
          >
            <el-table-column
              :label="$t('product.specification')"
              align="center"
              min-width="65"
            >
              <template slot-scope="{row}">
                {{ row.property }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('product.price1')"
              align="center"
              min-width="60"
            >
              <template slot-scope="{row}">
                ¥ {{ (row.price/100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('product.stock')"
              align="center"
              min-width="60"
            >
              <template slot-scope="{row}">
                {{ row.num }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.price')"
        width="100"
        align="center"
      >
        <template slot-scope="{row}">
          ¥ {{ (row.price/100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.classify')"
        align="center"
        width="120"
      >
        <template slot-scope="{row}">
          {{ row.productCategory }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        width="140"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span v-if="row.status===2">{{ $t('table.isDown') }}</span>
          <span v-if="row.status===1">{{ $t('table.isUp') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="140"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="actions('edit',row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.status == 2"
            type="text"
            @click="actions('status',row)"
          >
            {{ $t('table.statusUp') }}
          </el-button>
          <el-button
            v-if="row.status == 1"
            type="text"
            @click="actions('status',row)"
          >
            {{ $t('table.statusDown') }}
          </el-button>
          <el-button
            type="text"
            class="delBtn"
            @click="actions('del',row)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      layout="total, prev, pager, next, jumper"
      @pagination="getList('GET', 'product', listQuery)"
    />
  </div>
</template>

<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'Product',
  components: { Pagination },
  data() {
    return {
      theme: false,
      showReviewer: false,
      tableKey: 0,
      listData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        title: null,
        categoryId: null,
        status: null
      },
      productStatus: [{ name: '上架', status: 1 }, { name: '下架', status: 2 }],
      categoryList: []// 分类数据
    }
  },
  created() {
    this.getList('GET', 'product', this.listQuery)
    this.getCategoryList('GET', 'product/category/all')
  },
  methods: {
    // 列表数据
    getList(method, url, data) {
      for (const i in data) {
        if (data[ i ] === '') {
          delete data[ i ]
        }
      }
      requestData(method, url, data).then((res) => {
        console.log('getList', res)
        if (res && res.code === 0) {
          this.listData = res.data.data
          this.total = res.data.total
          this.productCategoryInfo()
        }
        this.listLoading = false
      })
    },
    // 分类列表
    getCategoryList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('getCategoryList', res)
        if (res && res.code === 0) {
          this.categoryList = res.data
        }
      })
    },
    // 分类匹配
    productCategoryInfo() {
      for (var i in this.listData) {
        for (var j in this.categoryList) {
          if (this.listData[ i ].categoryId === this.categoryList[ j ].id) {
            this.listData[ i ].productCategory = this.categoryList[ j ].name
          }
        }
      }
    },
    // 上下架
    upOrDownOrDel(method, url, data, flag) {
      if (flag === 1) {
        if (data.status === 1) {
          data.status = 2
        } else if (data.status === 2) {
          data.status = 1
        }
      }
      requestData(method, url, data).then((res) => {
        if (res && res.code === 0) {
          this.getList('GET', 'product', this.listQuery)
        }
      })
    },
    // 删除alert
    deleteAlert(data) {
      this.$confirm('确定删除商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upOrDownOrDel('PUT', 'product', { id: data.id, deleted: !data.deleted }, 2)
      })
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'edit':
          this.$router.push({ name: 'productInfo', query: { id: data.id }})
          break
        case 'add':
          this.$router.push({ name: 'productInfo' })
          break
        case 'status':
          this.upOrDownOrDel('PUT', 'product', { id: data.id, status: data.status }, 1)
          break
        case 'del':
          this.deleteAlert(data)
          break
      }
    }
  }
}
</script>
<style>
.img {
  width: 50px;
  text-align: left;
  float: left;
  margin-right: 10px;
}
.titleInfo {
  display: block;
  line-height: 50px;
  /* margin-top: 30px; */
}
.inputWidth {
  width: 180px !important;
}
</style>

