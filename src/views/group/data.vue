<template>
  <div class="page">
    <h3>{{ $t('route.groupData') }}</h3>
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
        width="60"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
        width="180"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('user.name')"
        align="center"
        width="160"
      >
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('user.phone')"
        width="130"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('group.title')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('group.type')"
        width="80px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.sponsor | typeFilter() }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <span v-if="row.status===2">支付</span>
          <span v-if="row.status===3">拼团失败</span>
          <span v-if="row.status===4">已核销</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="140"
      >
        <template slot-scope="{row}">
          <el-button
            v-if="row.status!=4"
            type="text"
            @click="writeOffAlert(row.id)"
          >
            {{ $t('group.writeOff') }}
          </el-button>

          <!-- <el-button
            type="text"
            class="delBtn"
            @click="actions('del',row)"
          >
            {{ $t('table.delete') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      layout="total, prev, pager, next, jumper"
      @pagination="getList('GET', url, listQuery)"
    />
  </div>
</template>
//
<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'GroupData',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      if (type === true) {
        return '团长'
      } else if (type === false) {
        return '团员'
      }
    }
  },
  data() {
    return {
      url: 'integrate_pruchase/record/back',
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
      productStatus: [{ name: '上架', status: 1 }, { name: '下架', status: 2 }]
    }
  },
  created() {
    this.getList('GET', this.url, this.listQuery)
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
        }
        this.listLoading = false
      })
    },
    // 核销
    writeOff(id, code) {
      console.log('id', id)
      requestData('POST', 'integrate_pruchase/record/verification', {
        id: id,
        code: code
      }).then((res) => {
        if (res && res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList('GET', this.url, this.listQuery)
        }
        this.listLoading = false
      })
    },
    // 核销 alert
    writeOffAlert(id) {
      console.log('id', id)
      this.$prompt('请输入核销码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '核销码不能为空',
        inputPlaceholder: '请输入核销码'
      }).then(({ value }) => {
        console.log('核销码', value)
        this.writeOff(id, value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
</script>

<style>
.img {
  width: 80px;
  text-align: left;
  float: left;
  margin-right: 10px;
}
.titleInfo {
  display: block;
  /* line-height: 50px; */
  /* margin-top: 30px; */
}
.inputWidth {
  width: 180px !important;
}
</style>

