<template>
  <div class="page">
    <h3>{{ $t('route.order') }}</h3>
    <div>
      <el-select
        v-model="listQuery.type"
        clearable
        :placeholder="$t('product.classifyAlert')"
        @change="getList('GET', 'order', listQuery)"
      >
        <el-option
          v-for="item in orderTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="orderTime"
        type="daterange"
        :range-separator="$t('table.to')"
        :start-placeholder="$t('table.startTime')"
        :end-placeholder="$t('table.endTime')"
        @change="chooseOrderTime"
      />
      <el-input
        v-model="listQuery.orderNum"
        :placeholder="$t('order.numAlert')"
        prefix-icon="el-icon-search"
        clearable
        class="inputWidth"
        @blur="getList('GET', 'order', listQuery)"
      />
      <span
        class="search"
        @click="dialogSearch = true"
      >{{ $t('table.advancedSearch') }}</span>
    </div>
    <div class="tab">
      <el-tabs
        v-model="activeName"
        @tab-click="getOrderStatus"
      >
        <el-tab-pane
          :label="$t('order.allOrder')"
          name="0"
        />
        <el-tab-pane
          :label="$t('order.toBePaid')"
          name="1"
        />
        <el-tab-pane
          :label="$t('order.toBeDelivered')"
          name="2"
        />
        <el-tab-pane
          :label="$t('order.Shipped')"
          name="6"
        />
        <el-tab-pane
          :label="$t('order.Cancelled')"
          name="4"
        />
      </el-tabs>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="50"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('order.productInfo')"
        align="center"
      >
        <template slot-scope="{row}">
          <div class="productInfo">
            <img
              :src="row.details[0].productListImg"
              class="img"
            >
            <p>{{ $t('product.title') }}:{{ row.details[0].productTitle }}</p>
            <p>{{ $t('product.classify') }}:{{ row.details[0].categoryName }}</p>
            <p>{{ $t('product.number') }}:{{ row.details[0].productSkuId }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('order.orderNum')"
        align="center"
        width="160"
      >
        <template slot-scope="{row}">
          {{ row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('order.price')"
        width="100"
        align="center"
      >
        <template slot-scope="{row}">
          ¥ {{ (row.totalPrice/100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('order.createTime')"
        align="center"
        width="160"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <span>{{ row.status | orderStatus() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="240"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.type==1&&row.status ==2"
            type="text"
            @click="actions('writeOff',row)"
          >
            {{ $t('group.writeOff') }}
          </el-button>
          <el-button
            type="text"
            @click="actions('editPrice',row)"
          >
            {{ $t('order.editPrice') }}
          </el-button>
          <el-button
            type="text"
            @click="actions('editAddress',row)"
          >
            {{ $t('order.editAddress') }}
          </el-button>
          <el-button
            type="text"
            class="delBtn"
            @click="actions('cancelOrder',row)"
          >
            {{ $t('order.cancelOrder') }}
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
      @pagination="getList('GET', 'order', listQuery)"
    />
    <!-- 高级筛选 -->
    <el-dialog
      :title=" $t('table.advancedSearch') "
      :visible.sync="dialogSearch"
    >
      <el-form :model="searchForm">
        <el-form-item
          :label="$t('order.orderDate')"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="searchForm.orderTime"
            type="daterange"
            :range-separator="$t('table.to')"
            :start-placeholder="$t('table.startTime')"
            :end-placeholder="$t('table.endTime')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('order.orderPrice')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="searchForm.minPrice"
            :placeholder="$t('order.orderPriceMin')"
            style="width: 200px;"
            type="number"
          /> -
          <el-input
            v-model="searchForm.maxPrice"
            :placeholder="$t('order.orderPriceMax')"
            style="width: 200px;"
            type="number"
          /> {{ $t('money') }}
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        :title="$t('table.alert')"
        :visible.sync="innerVisible"
        append-to-body
      >
        {{ innerVisivleInfo }}
      </el-dialog>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogSearch = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="setDialogSearch"
        >{{ $t('table.search') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改价格 -->
    <el-dialog
      :title="$t('order.editPrice')"
      :visible.sync="dialogSetPrice"
    >
      <el-form>
        <el-form-item
          label="订单价格: "
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="setPriceFrom"
            autocomplete="off"
            type="number"
            placeholder="请输入订单价格"
            style="width: 200px;"
          /> {{ $t('money') }}
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogSetPrice = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="editInfo(1)"
        >{{ $t('table.ok') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改地址 -->
    <el-dialog
      :title="$t('order.editAddress')"
      :visible.sync="dialogFormAddress"
    >
      <el-form :model="setFormAddress">
        <el-form-item
          :label="$t('user.name')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="setFormAddress.name"
            :placeholder="$t('user.namePlaceholder')"
            style="width: 400px;"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          :label="$t('user.phone')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="setFormAddress.phone"
            autocomplete="off"
            :placeholder="$t('user.phonePlaceholder')"
            type="number"
            style="width: 400px;"
          />
        </el-form-item>
        <el-form-item
          :label="$t('user.address')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="setFormAddress.address"
            type="textarea"
            :placeholder="$t('user.addressPlaceholder')"
            style="width: 400px;"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormAddress = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="editInfo(2)"
        >{{ $t('table.ok') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    orderStatus(data) {
      // * 订单状态 -1 删除 1 待支付 2 已支付,代发货(交易成功,未发货) 3 支付失败(任何交易报错,预下单失败) 4 已取消 5 已退款 6 待收货,已发货
      if (data === -1) {
        data = 0
      }
      const type = {
        0: '删除',
        1: '待支付',
        2: '待发货',
        3: '支付失败',
        4: '已取消',
        5: '已退款',
        6: '已发货'
      }
      return type[ data ]
    }
  },
  data() {
    return {
      API: {
        order: 'order/'
      },
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
        type: null,
        status: null,
        beginTime: null,
        endTime: null,
        orderNum: null,
        maxPrice: null,
        minPrice: null
      },
      productStatus: [{ name: '上架', status: 1 }, { name: '下架', status: 2 }],
      categoryList: [], // 分类数据
      orderTypeList: [
        {
          id: 1,
          name: '商品订单'
        },
        {
          id: 2,
          name: '团购订单'
        }
      ],
      activeName: '0',
      orderTime: null,
      dialogSearch: false, // 高级搜索显隐
      searchForm: {
        orderTime: null,
        minPrice: null,
        maxPrice: null
      },
      innerVisivleInfo: null, // 高级搜索
      innerVisible: false, // 高级搜索里面的弹窗
      formLabelWidth: '120px',
      setPriceFrom: null, // 修改价格金额
      dialogSetPrice: false, // 修改价格弹窗
      dialogFormAddress: false, // 修改地址弹窗
      // 修改地址内容
      setFormAddress: {
        name: null,
        phone: null,
        address: null
      },
      // 修改金额数据
      setPriceInfo: {},
      // 修改地址数据
      setAddressInfo: {},
      // 核销弹窗
      isWriteOff: false
    }
  },
  created() {
    this.getList('GET', this.API.order, this.listQuery)
  },
  methods: {
    // 订单状态筛选
    getOrderStatus(status) {
      console.log('订单状态筛选', status.name)
      if (status.name !== '0') {
        this.listQuery.status = status.name
      } else if (status.name === '0') {
        delete this.listQuery.status == null
      }
      console.log(this.listQuery)
      this.getList('GET', this.API.order, this.listQuery)
    },
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
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.listLoading = false
      })
    },
    // 选择 订单时间
    chooseOrderTime() {
      if (this.orderTime != null) {
        this.listQuery.beginTime = new Date(this.orderTime[ 0 ]).getTime()
        this.listQuery.endTime = new Date(this.orderTime[ 1 ]).getTime()
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      this.getList('GET', this.API.order, this.listQuery)
    },
    // 高级搜索
    setDialogSearch() {
      if (this.searchForm.minPrice != null && this.searchForm.maxPrice == null) {
        this.innerVisivleInfo = '请输入最大订单金额'
        this.innerVisible = true
      } else if (this.searchForm.maxPrice != null && this.searchForm.minPrice == null) {
        this.innerVisivleInfo = '请输入最小订单金额'
        this.innerVisible = true
      } else if (this.searchForm.maxPrice != null && this.searchForm.minPrice != null) {
        this.listQuery.minPrice = this.searchForm.minPrice / 100
        this.listQuery.maxPrice = this.searchForm.maxPrice / 100
      }

      if (this.searchForm.orderTime != null) {
        this.listQuery.beginTime = new Date(this.searchForm.orderTime[ 0 ]).getTime()
        this.listQuery.endTime = new Date(this.searchForm.orderTime[ 1 ]).getTime()
      }
      this.dialogSearch = false
      this.getList('GET', this.API.order, this.listQuery)
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
        console.log('upOrDownOrDel', res)
        if (res && res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogSetPrice = false
          this.dialogFormAddress = false
          this.getList('GET', this.API.order, this.listQuery)
        }
      })
    },
    // 删除alert
    deleteAlert(data) {
      this.$confirm('确定删除订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upOrDownOrDel('PUT', this.API.order, { id: data.id, deleted: !data.deleted }, 2)
      })
    },
    editInfo(info) {
      let data
      if (info === 1) {
        data = {
          id: this.chooseId,
          orderPrice: this.setPriceFrom * 100,
          totalPrice: this.setPriceFrom * 100
        }
      } else if (info === 2) {
        data = {
          id: this.chooseId,
          address: this.setFormAddress.address,
          name: this.setFormAddress.name,
          phone: this.setFormAddress.phone
        }
      }
      this.upOrDownOrDel('PUT', this.API.order, data)
    },
    // 修改价格
    editPrice(data) {
      this.dialogSetPrice = true
      this.setPriceFrom = (Number(data.orderPrice) / 100).toFixed(2)
      this.chooseId = data.id
    },
    // 修改地址
    editAddress(data) {
      this.dialogFormAddress = true
      this.chooseId = data.id
      this.setFormAddress = {
        name: data.name,
        phone: data.phone,
        address: data.address
      }
    },
    // 核销弹窗
    writeOffAlert(data) {
      this.$prompt('请输入核销码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '核销码不能为空',
        inputPlaceholder: '请输入核销码'
      }).then(({ value }) => {
        console.log('核销码', value)
        this.upOrDownOrDel('PUT', this.API.order, {
          id: data.id,
          status: 6,
          code: value
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'writeOff':
          this.writeOffAlert(data)
          break
        case 'editPrice':
          this.editPrice(data)
          break
        case 'editAddress':
          this.editAddress(data)
          break
        case 'cancelOrder':
          this.deleteAlert(data)
          break
      }
    }
  }
}
</script>

<style>
.productInfo {
  width: 100%;
  text-align: left;
}
.img {
  width: 90px;
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
.tab {
  font-size: 12px;
}
.search {
  margin: 0 5px;
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
}
</style>

