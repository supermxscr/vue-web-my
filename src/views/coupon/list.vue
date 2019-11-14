<template>
  <div class="page">
    <h3>{{ $t('coupon.couponCenter') }}</h3>
    <div>
      <div
        v-for="item in addBtnInfo"
        :key="item.type"
        class="addbox"
      >
        <img
          :src="require('../../static/images/'+item.bgcSrc)"
          class="addbox-img"
        >
        <p class="addbox-name name">{{ item.name }}</p>
        <p class="addbox-name eg">{{ item.eg }}</p>
        <p class="addbox-name description">{{ item.description }}</p>
        <div
          class="addbtn"
          :style="'color:'+item.color"
          @click="actions('add',item.type)"
        >立即创建</div>
      </div>
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
        :label="$t('coupon.couponName')"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.couponType')"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.couponTime')"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.couponStatus')"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.stock')"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.nickname }}
          <!-- <svg-icons
            icon-class="edit"
            class-name="disabled"
            @click="setStock(row.id)"
          /> -->
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.receivingAmount')"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.nuclearSales')"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="240"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="actions('edit',row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            type="text"
            @click="actions('report',row)"
          >
            {{ $t('table.report') }}
          </el-button>
          <el-button
            type="text"
            @click="actions('serving',row)"
          >
            {{ $t('table.serving') }}
          </el-button>
          <el-button
            type="text"
            @click="actions('link',row)"
          >
            {{ $t('table.link') }}
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
      @pagination="getList('GET', API.coupon, listQuery)"
    />
  </div>
</template>

<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
import svgIcons from './svg-icons'
export default {
  name: 'CouponList',
  components: { Pagination, svgIcons },
  data() {
    return {
      API: {
        coupon: 'coupon/code'
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
        status: 4
      },
      couponNum: null,
      addBtnInfo: [{
        bgcSrc: 'fullyvouchers.png',
        type: 1,
        name: '满减券',
        eg: '例: 满100减20',
        description: '便于合理控制成本',
        color: '#F7BA44'
      }, {
        bgcSrc: 'discountCoupon.png',
        type: 2,
        name: '折扣券',
        eg: '例: 满100打9折',
        description: '提高店铺销量和客价单',
        color: '#A688E2'
      }, {
        bgcSrc: 'voucher.png',
        type: 3,
        name: '礼品券',
        eg: '例: 礼品券',
        description: '提高店铺销量和客价单',
        color: '#58CCD0'
      }, {
        bgcSrc: 'randomCoupon.png',
        type: 4,
        name: '随机金额券',
        eg: '例: 1-20元随机金额抵扣',
        description: '提高店铺销量和客价单',
        color: '#EDACC7'
      }]
    }
  },
  created() {
    this.getList('GET', this.API.coupon, this.listQuery)
  },
  methods: {
    // 数据
    getList(method, url, data) {
      for (const i in data) {
        if (data[ i ] === '') {
          delete data[ i ]
        }
      }
      requestData(method, url, data).then((res) => {
        console.log('getList', res)
        if (res && res.code === 0) {
          switch (method) {
            case 'GET':
              this.listData = res.data.data
              this.total = res.data.total
              break
            case 'PUT':
              this.$message({
                type: 'success',
                message: '核销成功!'
              })
              this.couponNum = null
              setTimeout(() => {
                this.getList('GET', this.API.coupon, this.listQuery)
              }, 200)
              break
          }
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.listLoading = false
      })
    },
    setStock(id) {
      console.log('设置库存', id)
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'add':
          this.$router.push({ name: 'couponInfo', query: { type: data }})
          break
      }
    }

  }
}
</script>
<style scoped>
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
.disabled {
  pointer-events: none;
}
.addbox {
  display: inline-block;
  position: relative;
  color: #fff;
  font-size: 15px;
  margin-right: 20px;
}
.addbox-img {
  width: 200px;
  float: left;
}
.addbox-name {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 10px;
  font-size: 13px;
}
.name {
  font-size: 16px;
  font-weight: bold;
}
.eg {
  top: 36px;
}
.description {
  top: 50px;
}
.addbtn {
  background: #fff;
  color: #000;
  position: absolute;
  right: 10px;
  bottom: 10px;
  text-align: center;
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 10px;
  /* line-height: ; */
}
</style>

