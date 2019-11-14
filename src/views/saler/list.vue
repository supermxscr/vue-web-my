<template>
  <div class="page">
    <h3>{{ $t('route.saler') }}</h3>
    <div>
      <el-button
        type="primary"
        @click="actions('add')"
      >{{ $t('table.add') }}</el-button>
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
        width="60"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.headImg')"
        align="center"
      >
        <template slot-scope="{row}">
          <img
            :src="row.headImg"
            class="img"
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.name')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.phone')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.identifier }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.createTime | dateformat() }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
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
      @pagination="getList('GET', API.saler, listQuery)"
    />
  </div>
</template>
<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'Saler',
  components: { Pagination },
  data() {
    return {
      API: {
        saler: 'saler/'
      },
      tableKey: 0,
      listData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.getList('GET', this.API.saler, this.listQuery)
  },
  methods: {
    // 列表数据
    getList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('getList', res)
        if (res && res.code === 0) {
          this.listData = res.data.data
          this.total = res.data.total
        }
        this.listLoading = false
      })
    },
    // 上下架 or 删除
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
          this.getList('GET', this.API.saler, this.listQuery)
        }
      })
    },
    // 删除alert
    deleteAlert(data) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upOrDownOrDel('PUT', this.API.saler, { id: data.id, deleted: !data.deleted }, 2)
      })
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'add':
          this.$router.push({ name: 'salerInfo' })
          break
        case 'edit':
          this.$router.push({ name: 'salerInfo', query: { id: data.id }})
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

