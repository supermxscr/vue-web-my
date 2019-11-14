<template>
  <div class="page">
    <h3>{{ $t('coupon.couponWriteOff') }}</h3>
    <el-input
      v-model="couponNum"
      type="textarea"
      autosize
      :placeholder="$t('coupon.writeOffAlert')"
      style="width:300px;"
    />
    <el-button
      type="primary"
      @click="checkNum()"
    >{{ $t('coupon.writeOff') }}</el-button>

    <h3>{{ $t('coupon.writeOffRecord') }}</h3>
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
        :label="$t('coupon.couponNum')"
        align="center"
        width="200"
      >
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        width="200"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.client')"
        align="center"
        width="200"
      >
        <template slot-scope="{row}">
          {{ row.nickname }}
        </template>
      </el-table-column>
      <!-- <el-table-column
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
      </el-table-column> -->
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
export default {
  name: 'CouponList',
  components: { Pagination },
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
      couponNum: null
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
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'writeOff':
          this.checkNum()
          break
      }
    },
    checkNum() {
      if (this.couponNum == null || this.couponNum === '') {
        this.$message({
          type: 'error',
          message: '请输入核销码'
        })
      } else {
        this.getList('PUT', this.API.coupon, { code: this.couponNum, status: 4 }, 1)
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

