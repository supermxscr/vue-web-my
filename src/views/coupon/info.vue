<template>
  <div class="page">
    <h3
      v-if="!addOrEdit"
      style="display:inline-block;"
    >{{ $t('coupon.create') }}</h3>
    <h3
      v-if="addOrEdit"
      style="display:inline-block;"
    >{{ $t('product.edit') }}</h3>
    <h3
      v-if="couponType ==1"
      style="display:inline-block"
    >{{ $t('coupon.fullReduction') }}</h3>
    <h3
      v-if="couponType ==2"
      style="display:inline-block"
    >{{ $t('coupon.discount') }}</h3>
    <h3
      v-if="couponType= 3"
      style="display:inline-block"
    >{{ $t('coupon.gift') }}</h3>
    <h3
      v-if="couponType ==4"
      style="display:inline-block"
    >{{ $t('coupon.voucher') }}</h3>

    <!-- 基础信息 -->
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- 标题 -->
      <el-form-item
        :label="$t('coupon.title')"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          style="width:50%"
          :placeholder="$t('coupon.titleAlert')"
        />
      </el-form-item>
      <!-- 卡券颜色 -->
      <el-form-item
        :label="$t('coupon.color')"
        prop="color"
      >
        <el-radio-group v-model="ruleForm.color">
          <el-radio
            v-for="item in couponColor"
            :key="item"
            :label="item"
          >
            <div
              class="colorbox"
              :style="{backgroundColor:item}"
            />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 发行总量 -->
      <el-form-item
        :label="$t('coupon.circulation')"
        prop="circulation"
      >
        <el-input
          v-model="ruleForm.circulation"
          style="width:50%;mergin-right:10px;"
          :placeholder="$t('coupon.circulationAlert')"
        />
        <span>{{ $t('zhang') }}</span>
        <div style="color:#ccc;">{{ $t('coupon.circulationInfo') }}</div>
      </el-form-item>
      <!-- 折扣额度 -->
      <el-form-item
        :label="$t('coupon.discountAmount')"
        prop="discountAmount"
      >
        <el-input
          v-model="ruleForm.discountAmount"
          style="width:50%;mergin-right:10px;"
          :placeholder="$t('coupon.discountAmountAlert')"
        />
        <span>{{ $t('zhe') }}</span>
        <div style="color:#ccc;">{{ $t('coupon.discountAmountInfo') }}</div>
      </el-form-item>

      <!-- 使用说明 -->
      <el-form-item :label="$t('coupon.useDescription')">
        <tinymce
          v-model="ruleForm.useDescriptione"
          :height="300"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="actions('save')"
        >{{ $t('table.save') }}</el-button>
        <el-button
          type="success"
          @click="actions('saveAndUp')"
        >{{ $t('table.saveAndPut') }}</el-button>
        <el-button @click="actions('cancel')">{{ $t('table.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { requestData } from '@/api/api'
import defaultSettings from '@/settings'
export default {
  name: 'ProductInfo',
  components: {
    Tinymce
  },
  data() {
    return {
      API: {
        product: 'product/',
        category: 'product/category/all/'
      },
      upUrl: defaultSettings.baseURL + defaultSettings.uploadUrl,
      theme: false,
      addOrEdit: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        title: null, // 标题
        color: null, // 卡券颜色
        circulation: null, // 发行总量
        discountAmoun: null, // 折扣额度
        img: [], // 商品图片
        listImg: null, // 列表图片
        categoryId: null, // 商品分类id
        status: 2, // 1上架 2下架
        price: null, // 商品价格
        useDescriptione: null, // 使用须知
        propertyName: null, // 规格名
        productSkuList: [],
        sort: 1 // 排序
      },
      property: null,
      rules: {
        title: [
          { required: true, message: 'Please enter the product title', trigger: 'blur' }
        ],
        color: [
          { required: true }
        ],
        circulation: [
          { required: true, message: 'Please enter the coupon circulation', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'Please enter the product price', trigger: 'blur' }
        ]
      },
      couponType: 1, // 卡券类型
      couponColor: ['#63b359', '#2c9f67', '#509fc9', '#5885cf', '#9062c0', '#d09a45', '#e4b138', '#ee903c', '#f08500', '#a9d92d', '#dd6549', '#cc463d', '#cf3e36', '#5E6671', '#FA4B9B'] // 卡券颜色
    }
  },
  created() {
    this.couponType = this.$route.query.id
    this.addOrEdit = !!this.$route.query.id
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.product + this.$route.query.id)
    }
  },
  methods: {

    // 获取详情
    getDetils(method, url) {
      requestData(method, url).then((res) => {
        console.log('getDetils', res)
        if (res && res.code === 0) {
          this.ruleForm = res.data
          this.ruleForm.price = (res.data.price / 100).toFixed(2)
          this.ruleForm.img = JSON.parse(res.data.img)
          for (const i in this.ruleForm.img) {
            this.fileList.push({ name: i, url: this.ruleForm.img[ i ] })
          }
        }
      })
    },
    actions(action) {
      console.log(action)
      switch (action) {
        case 'cancel':
          this.$router.push({ name: 'product' })
          break
        case 'saveAndUp':
          this.submitForm('ruleForm', action)
          break
        case 'save':
          this.submitForm('ruleForm', action)
          break
      }
    },
    submitForm(formName, action) {
      this.$refs[ formName ].validate((valid) => {
        if (valid) {
          if (action === 'saveAndUp') {
            this.ruleForm.status = 1
          }
          if (this.addOrEdit) {
            this.sub('PUT', this.API.product, this.ruleForm)
          } else {
            delete this.ruleForm[ 'id' ]
            this.sub('POST', this.API.product, this.ruleForm)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sub(method, url, data) {
      console.log('--sub--', data)
      requestData(method, url, data).then((res) => {
        console.log('sub', res)
        if (res && res.code === 0) {
          this.$router.push({ name: 'product' })
        }
      })
    }
  }
}
</script>
<style scoped>
.colorbox {
  width: 60px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
}
.custom-theme .el-radio + .el-radio {
  margin-left: 0;
  margin-bottom: 10px;
}
</style>
