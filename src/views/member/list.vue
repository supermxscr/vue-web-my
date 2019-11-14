<template>
  <div class="page">
    <h3>{{ $t('route.member') }}</h3>
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
        :label="$t('member.avatarAndnickName')"
        align="center"
      >
        <template slot-scope="{row}">
          <img
            :src="row.headImgUrl"
            class="img"
          >
          <span class="titleInfo">{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.phoneNumber')"
        width="120"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.cardNumber')"
        width="120"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.cardNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.integral')"
        width="80"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.points }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.gender')"
        width="60"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.sex | gender() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.area')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.country }}{{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('member.registrationDate')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.createTime | dateformat() }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :label="$t('table.status')"
        width="80"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.status }}
        </template>
      </el-table-column> -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="60"
      >
        <template slot-scope="{row}">
          <!-- <el-button
            type="text"
            size="mini"
            @click="goEditOrAdd(row.id)"
          >
            {{ $t('table.edit') }}
          </el-button> -->
          <el-button
            size="mini"
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
      @pagination="getList('GET', 'user', listQuery)"
    />
  </div>
</template>

<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'Product',
  components: { Pagination },
  filters: {
    gender(gender) {
      if (gender === 1) {
        return '男'
      } else if (gender === 2) {
        return '女'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
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
  computed: {},
  created() {
    this.getList('GET', 'user', this.listQuery)
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
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.listLoading = false
      })
    },
    // 上下架 or 删除
    upOrDownOrDel(method, url, data, flag) {
      requestData(method, url, data).then((res) => {
        console.log('upOrDownOrDel', res)
        if (res && res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogSetPrice = false
          this.dialogFormAddress = false
          this.getList('GET', 'user', this.listQuery)
        }
      })
    },
    // 删除alert
    deleteAlert(data) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upOrDownOrDel('PUT', 'user', { id: data.id, deleted: !data.deleted }, 2)
      })
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'edit':
          break
        case 'add':
          break
        case 'status':
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
</style>

