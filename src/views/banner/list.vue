<template>
  <div class="page">
    <h3>{{ $t('route.banner') }}</h3>
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
        :label="$t('banner.bannerImg')"
        align="center"
      >
        <template slot-scope="{row}">
          <img
            :src="row.img"
            class="img"
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.title')"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.classify')"
        min-width="30px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.applyTo | setType() }}</span>
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
        :label="$t('table.status')"
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <span v-if="row.status===2">{{ $t('table.isDown') }}</span>
          <span v-if="row.status===1">{{ $t('table.isUp') }}</span>
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
      @pagination="getList('GET', API.banner, listQuery)"
    />
  </div>
</template>
<script>
import { requestData } from '@/api/api'
import Pagination from '@/components/Pagination'
export default {
  name: 'Banner',
  components: { Pagination },
  filters: {
    setType(type) {
      if (type === 1) {
        return '首页广告'
      } else if (type === 2) {
        return '拼团广告'
      } else if (type === 3) {
        return '活动广告'
      }
    }
  },
  data() {
    return {
      API: {
        banner: 'banner/'
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
    this.getList('GET', this.API.banner, this.listQuery)
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
          this.getList('GET', this.API.banner, this.listQuery)
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
        this.upOrDownOrDel('PUT', this.API.banner, { id: data.id, deleted: !data.deleted }, 2)
      })
    },
    actions(action, data) {
      console.log(action, data)
      switch (action) {
        case 'add':
          this.$router.push({ name: 'bannerInfo' })
          break
        case 'edit':
          this.$router.push({ name: 'bannerInfo', query: { id: data.id }})
          break
        case 'status':
          this.upOrDownOrDel('PUT', this.API.banner, { id: data.id, status: data.status }, 1)
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
  width: 100px;
  text-align: center;
  float: left;
  /* margin: 0 auto; */
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

