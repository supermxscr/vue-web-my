<template>
  <div class="page">
    <h3 v-if="!addOrEdit">{{ $t('group.add') }}</h3>
    <h3 v-if="addOrEdit">{{ $t('group.edit') }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <!-- 拼团标题 -->
      <el-form-item
        :label="$t('group.infoTitle')"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          style="width:50%"
          :placeholder="$t('group.titleAlert')"
        />
      </el-form-item>
      <!-- 拼团原价 -->
      <el-form-item
        :label="$t('group.originalPrice')"
        prop="productPrice"
      >
        <el-input
          v-model="ruleForm.productPrice"
          style="width:50%"
          :placeholder="$t('group.originalPricePlaceholder')"
        />
        <span>{{ $t('money') }}</span>
      </el-form-item>
      <!-- 拼团价格 -->
      <el-form-item
        :label="$t('group.price')"
        prop="integratePurchasePrice"
      >
        <el-input
          v-model="ruleForm.integratePurchasePrice"
          style="width:50%;mergin-right:10px;"
          :placeholder="$t('group.pricePlaceholder')"
        />
        <span>{{ $t('money') }}</span>
      </el-form-item>
      <!-- 拼团类型 -->
      <el-form-item
        :label="$t('group.grouptype')"
        prop="type"
      >
        <el-select
          v-model="ruleForm.type"
          style="width:50%"
          :placeholder="$t('group.typePlaceholder')"
        >
          <el-option
            v-for="item in categoryListData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 拼团人数 -->
      <el-form-item
        :label="$t('group.groupPeopleNum')"
        prop="limitNum"
      >
        <el-select
          v-model="ruleForm.limitNum"
          style="width:50%"
          :placeholder="$t('group.peopleNumPlaceholder')"
        >
          <el-option
            v-for="item in groupUserNum"
            :key="item.num"
            :label="item.name"
            :value="item.num"
          />
        </el-select>
      </el-form-item>
      <!-- 存续时间 -->
      <el-form-item
        :label="$t('group.duration')"
        prop="limitTime"
      >
        <el-select
          v-model="ruleForm.limitTime"
          style="width:50%"
          :placeholder="$t('group.durationPlaceholder')"
        >
          <el-option
            v-for="item in groupTime"
            :key="item.num"
            :label="item.name"
            :value="item.num"
          />
        </el-select>
      </el-form-item>
      <!-- 拼团日期 -->
      <el-form-item
        :label="$t('group.date')"
        required
      >
        <el-date-picker
          v-model="groupDate"
          type="datetimerange"
          :range-separator="$t('table.to')"
          :start-placeholder="$t('table.startTime')"
          :end-placeholder="$t('table.endTime')"
        />
      </el-form-item>
      <!-- 关联商品 -->
      <el-form-item
        :label="$t('group.relatedGoods')"
        class="m-b"
        required
      >
        <el-select
          v-model="category"
          :placeholder="$t('product.classifyAlert')"
          @change="choseCategory"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="ruleForm.productId"
          :placeholder="$t('product.chooseProductAlert')"
          style="width: 260px"
          @change="choseProduct"
        >
          <el-option
            v-for="item in listInfo"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 拼团分享图 -->
      <el-form-item
        :label="$t('group.shareImg')"
        required
      >
        <el-upload
          :show-file-list="false"
          :on-success="productImg"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          :action="upUrl"
        >
          <img
            v-if="ruleForm.shareImg"
            :src="ruleForm.shareImg"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />

        </el-upload>
        <span class="sizeInfo">建议尺寸300*300</span>
      </el-form-item>
      <!-- 详情轮播图 -->
      <el-form-item
        :label="$t('group.detailsCarousel')"
        required
      >
        <el-upload
          :on-preview="bannerListImg"
          :on-remove="bannerListImgRemove"
          :on-success="bannerListImgSuccess"
          :action="upUrl"
          :file-list="fileList"
          list-type="picture-card"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img
            :src="dialogImageUrl"
            width="100%"
            alt=""
          >
        </el-dialog>
        <span class="sizeInfo m-t10">建议尺寸750*347</span>
      </el-form-item>
      <!-- 拼团列表图 -->
      <el-form-item
        :label="$t('group.listImg')"
        required
      >
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          :action="upUrl"
        >
          <img
            v-if="ruleForm.listImg"
            :src="ruleForm.listImg"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />

        </el-upload>
        <span class="sizeInfo">建议尺寸750*347</span>
      </el-form-item>
      <el-form-item
        :label="$t('group.details')"
        required
      >
        <tinymce
          v-model="ruleForm.description"
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
  name: 'GroupInfo',
  components: {
    Tinymce
  },
  data() {
    return {
      API: {
        product: 'product/',
        activity: 'integrate_pruchase/activity/',
        category: 'product/category/all/'
      },
      upUrl: defaultSettings.baseURL + defaultSettings.uploadUrl,
      theme: false,
      addOrEdit: null,
      dialogVisible: false,
      dialogImageUrl: null,
      categoryListData: [{
        name: '老带新',
        id: 1
      }, {
        name: '全民参与',
        id: 2
      }],
      groupUserNum: [{
        num: 2,
        name: '2人'
      },
      {
        num: 3,
        name: '3人'
      }],
      groupTime: [], // 拼团存续时间
      groupDate: null, // 拼团日期
      category: null,
      listInfo: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        title: null, // 标题
        type: null, // 1老带新 2全民参与
        shareImg: null, // 分享图
        limitNum: null, // 限制拼团人数
        limitTime: null, // 限制拼团存续时间:单位小时
        productId: null, // 商品id
        productPrice: null, // 商品价格
        integratePurchasePrice: null, // 商品拼团价格
        integratePurchaseImg: [], // 列表详情图
        listImg: null, // 列表图片
        beginTime: null, // 开始时间
        endTime: null, // 结束时间
        status: 2, // 1上架 2下架
        description: null // 拼团详情
      },
      rules: {
        title: [
          { required: true, message: 'Please enter the product title', trigger: 'blur' }
        ],
        productPrice: [
          { required: true, message: 'Please enter product productPrice', trigger: 'blur' }
        ],
        integratePurchasePrice: [
          { required: true, message: 'Please enter the product price', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please choose group type', trigger: 'change' }
        ],
        limitTime: [
          { required: true, message: 'Please choose group limitTime', trigger: 'change' }
        ],
        limitNum: [
          { required: true, message: 'Please choose limit group people number', trigger: 'change' }
        ]
        // groupDate: [
        //   { required: true, message: 'Please choose group date', trigger: 'blur' }
        // ],
        // category: [
        //   { required: true, message: 'Please choose related goods', trigger: 'change' }
        // ],
        // shareImg: [
        //   { required: true, message: 'Please upload group share image', trigger: 'blur' }
        // ],
        // bannerListImg: [
        //   { required: true, message: 'Please upload group bannerListImg', trigger: 'blur' }
        // ],
        // listImg: [
        //   { required: true, message: 'Please upload group listImg', trigger: 'blur' }
        // ],
        // description: [
        //   { required: true, message: 'Please upload group listImg', trigger: 'blur' }
        // ]
      },
      categoryList: [], // 分类数据
      sortArr: [], // 排序数据
      fileList: [],
      groupDate1: null
    }
  },
  created() {
    this.addOrEdit = !!this.$route.query.id
    this.getCategoryList('GET', this.API.category)
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.activity + this.$route.query.id)
    }
    this.setGroupTime()
  },
  methods: {
    // 拼团存续时间
    setGroupTime() {
      for (let i = 0; i < 24; i++) {
        this.groupTime.push({
          num: i + 1,
          name: i + 1 + '小时'
        })
      }
    },
    // 拼团列表图
    handleAvatarSuccess(res, file) {
      console.log('拼团列表图', res)
      this.ruleForm.listImg = res.data
      console.log(file)
    },
    // 拼团分享图
    productImg(res, file) {
      console.log('拼团分享图', res)
      this.ruleForm.shareImg = res.data
      console.log(file)
    },
    // 移除图片
    bannerListImgRemove(file, fileList) {
      for (const i in this.ruleForm.integratePurchaseImg) {
        if (this.ruleForm.integratePurchaseImg[ i ] === file.url) {
          this.ruleForm.integratePurchaseImg.splice(i, 1)
        }
      }
    },
    // banner图片 显示
    bannerListImg(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      this.ruleForm.integratePurchaseImg.push(this.dialogImageUrl)
    },
    // banner图片 多图
    bannerListImgSuccess(file, fileList) {
      this.ruleForm.integratePurchaseImg.push(file.data)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 拼团获取详情
    getDetils(method, url) {
      requestData(method, url).then((res) => {
        console.log('拼团获取详情', res)
        if (res && res.code === 0) {
          this.ruleForm = res.data
          this.producInfo(res.data.productId)
          this.ruleForm = res.data
          this.ruleForm.integratePurchaseImg = JSON.parse(res.data.integratePurchaseImg)
          this.ruleForm.productPrice = (Number(res.data.productPrice) / 100).toFixed(2)
          this.ruleForm.integratePurchasePrice = (res.data.integratePurchasePrice / 100).toFixed(2)
          this.groupDate = [res.data.beginTime * 1000, res.data.endTime * 1000]
          this.groupDate1 = [res.data.beginTime * 1000, res.data.endTime * 1000]
          for (const i in this.ruleForm.integratePurchaseImg) {
            this.fileList.push({ name: i, url: this.ruleForm.integratePurchaseImg[ i ] })
          }
        }
      })
    },
    // 商品分类列表
    getCategoryList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('商品分类列表', res)
        if (res && res.code === 0) {
          this.categoryList = res.data
        }
      })
    },
    // 改变分类,查询商品数据
    choseCategory() {
      this.getProductList('GET', this.API.product, { page: 1,
        size: 1000,
        title: null,
        status: null,
        categoryId: this.category })
    },
    // 分类下的 商品列表
    getProductList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('分类下的 商品列表', res)
        if (res && res.code === 0) {
          this.listInfo = res.data.data
        }
      })
    },
    // 选择商品
    choseProduct() {
      this.producInfo(this.ruleForm.productId)
    },
    // 商品详情
    producInfo(id) {
      requestData('GET', this.API.product + id).then((res) => {
        console.log('商品详情', res)
        if (res && res.code === 0) {
          this.ruleForm.productPrice = (res.data.price / 100).toFixed(2)
          for (let i = 0; i < this.categoryList.length; i++) {
            if (res.data.categoryId === this.categoryList[ i ].id) {
              this.category = this.categoryList[ i ].id
            }
          }
          console.log(this.category)
          this.getProductList('GET', this.API.product, { page: 1,
            size: 1000,
            title: null,
            status: null,
            categoryId: this.category })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    actions(action) {
      switch (action) {
        case 'cancel':
          this.$router.push('/group/list')
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
            this.sub('PUT', this.API.activity, this.ruleForm)
          } else {
            delete this.ruleForm[ 'id' ]
            this.sub('POST', this.API.activity, this.ruleForm)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sub(method, url, data) {
      this.ruleForm.productPrice = this.ruleForm.productPrice * 100
      this.ruleForm.integratePurchasePrice = this.ruleForm.integratePurchasePrice * 100
      console.log('------sub------', this.ruleForm)
      console.log(this.groupDate)
      if (this.groupDate1[ 0 ] === this.groupDate[ 0 ]) {
        this.ruleForm.beginTime = this.groupDate[ 0 ] / 1000
        this.ruleForm.endTime = this.groupDate[ 1 ] / 1000
      } else {
        this.ruleForm.beginTime = this.groupDate[ 0 ].getTime() / 1000
        this.ruleForm.endTime = this.groupDate[ 1 ].getTime() / 1000
      }

      const img = JSON.stringify(this.ruleForm.integratePurchaseImg)
      this.ruleForm.integratePurchaseImg = img
      requestData(method, url, data).then((res) => {
        console.log('sub', res)
        if (res && res.code === 0) {
          this.$router.push('/group/list')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
