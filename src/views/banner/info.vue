<template>
  <div class="page">
    <h3 v-if="!addOrEdit">{{ $t('banner.add') }}</h3>
    <h3 v-if="addOrEdit">{{ $t('banner.edit') }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('banner.title')"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          style="width:50%"
          :placeholder="$t('content.titleAlert')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('banner.bannerImg')"
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
            v-if="ruleForm.img"
            :src="ruleForm.img"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </el-upload>
        <span class="sizeInfo">建议尺寸771*458</span>
      </el-form-item>
      <!-- 跳转链接 -->
      <el-form-item
        :label="$t('banner.jumpUrl')"
        required
      >
        <el-radio-group v-model="ruleForm.type">
          <el-radio
            :label="1"
            @change="changeRadio"
          >跳转商品</el-radio>
          <el-radio
            :label="2"
            @change="changeRadio"
          >跳转拼团</el-radio>
          <!-- <el-radio
            :label="3"
            @change="changeRadio"
          >跳转活动</el-radio> -->
          <el-radio
            :label="4"
            @change="changeRadio"
          >自定义链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 关联商品 -->
      <el-form-item
        v-show="isRadio1"
        :label="$t('banner.aboutProduct')"
        required
      >
        <el-select
          v-model="category"
          placeholder="请选择分类"
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
          v-model="ruleForm.typeId"
          placeholder="请选择商品"
          style="width: 260px"
        >
          <el-option
            v-for="item in listInfo"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 拼团活动 -->
      <el-form-item
        v-show="isRadio2"
        :label="$t('banner.jumpGroup')"
      >
        <el-select
          v-model="ruleForm.typeId"
          placeholder="请选择拼团活动"
        >
          <el-option
            v-for="item in groupArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 活动 -->
      <el-form-item
        v-show="isRadio3"
        :label="$t('banner.jumpActive')"
      >
        <el-select
          v-model="ruleForm.typeId"
          placeholder="请选择关联活动"
        >
          <el-option
            v-for="item in activityArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 自定义链接 -->
      <el-form-item
        v-show="isRadio4"
        :label="$t('banner.customLink')"
      >
        <el-input
          v-model="ruleForm.url"
          type="text"
          style="width: 500px"
        />
      </el-form-item>
      <el-form-item
        :label="$t('banner.usePage')"
        required
      >
        <el-select
          v-model="ruleForm.applyTo"
          placeholder="请选"
        >
          <el-option
            v-for="item in applyToArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('product.sort')"
        prop="sort"
      >
        <el-select
          v-model="ruleForm.sort"
          style="width:50%"
          :placeholder="$t('product.sortAlert')"
        >
          <el-option
            v-for="item in sortArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
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
import { requestData } from '@/api/api'
import defaultSettings from '@/settings'
export default {
  name: 'BannerInfo',
  data() {
    return {
      API: {
        banner: 'banner/',
        category: 'product/category/all/',
        product: 'product/',
        group: 'integrate_pruchase/activity'
      },
      upUrl: defaultSettings.baseURL + defaultSettings.uploadUrl,
      theme: false,
      addOrEdit: null,
      dialogVisible: false,
      dialogImageUrl: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        'title': null, // 标题
        'type': 1, // 跳转链接type 1 商品 2 拼图 3 活动 4 自定义
        'img': null, // banner图片
        'url': null, // 跳转链接
        'status': 2, // 1上架 2下架
        'typeId': null, // 商品id 或者 拼团活动 id
        'applyTo': null, // 应用于哪个页面
        'sort': 1
      },
      rules: {
        title: [
          { required: true, message: 'Please enter the banner title', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: 'Please choose banner sort', trigger: 'change' }
        ]
      },
      applyToArr: [{ id: 1, name: '首页' }, { id: 2, name: '拼团' }],
      sortArr: [], // 排序数据
      isRadio1: true, // 关联商品
      isRadio2: false, // 关联拼团
      isRadio3: false, // 关联活动
      isRadio4: false, // 关联自定义
      bannerType: null,
      category: null,
      listInfo: null,
      categoryList: null,
      activityArr: null,
      groupArr: null // 拼团活动list
    }
  },
  created() {
    this.addOrEdit = !!this.$route.query.id
    this.setSort()
    this.getCategoryList('GET', this.API.category)
    this.getGroupList('GET', this.API.group, { page: 1, size: 100 })
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.banner + this.$route.query.id)
    }
  },
  methods: {
    // banner图
    handleAvatarSuccess(res, file) {
      this.ruleForm.img = res.data
    },
    // banner图
    productImg(res, file) {
      this.imageUrl = res.dat
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 排序
    setSort() {
      for (let i = 1; i < 11; i++) {
        this.sortArr.push(i)
      }
    },
    // 选择 跳转地址
    changeRadio() {
      this.ruleForm.typeId = null
      if (this.ruleForm.type === 1) {
        this.isRadio1 = true
        this.isRadio2 = false
        this.isRadio3 = false
        this.isRadio4 = false
      } else if (this.ruleForm.type === 2) {
        this.isRadio2 = true
        this.isRadio1 = false
        this.isRadio3 = false
        this.isRadio4 = false
      } else if (this.ruleForm.type === 3) {
        this.isRadio3 = true
        this.isRadio1 = false
        this.isRadio2 = false
        this.isRadio4 = false
      } else if (this.ruleForm.type === 4) {
        this.isRadio4 = true
        this.isRadio1 = false
        this.isRadio3 = false
        this.isRadio2 = false
      }
    },
    // 获取详情
    getDetils(method, url) {
      requestData(method, url).then((res) => {
        console.log('getDetils', res)
        if (res && res.code === 0) {
          this.ruleForm = res.data
          this.ruleForm.type = res.data.type
          this.changeRadio()
          this.ruleForm = res.data
          if (res.data.type === 1) {
            this.producInfo(res.data.typeId)
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
      this.producInfo(this.ruleForm.typeId)
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
    // 拼团列表数据
    getGroupList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('拼团列表数据', res)
        if (res && res.code === 0) {
          this.groupArr = res.data.data
        }
        this.listLoading = false
      })
    },
    actions(action) {
      console.log(action)
      switch (action) {
        case 'cancel':
          this.$router.push({ name: 'banner' })
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
            this.sub('PUT', this.API.banner, this.ruleForm)
          } else {
            delete this.ruleForm[ 'id' ]
            this.sub('POST', this.API.banner, this.ruleForm)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sub(method, url, data) {
      console.log('--sub--', data)
      if (this.ruleForm.type === 1) {
        if (window.location.host === 'yueyue.mchances.com') {
          this.ruleForm.url = '../product/product-details/product-details?id=' + this.ruleForm.typeId
        } else {
          this.ruleForm.url = '../luoji-product/product-details/product-details?id=' + this.ruleForm.typeId
        }
      } else if (this.subruleFormData.type === 2) {
        if (window.location.host === 'yueyue.mchances.com') {
          this.ruleForm.url = '../group-details/group-details?id=' + this.ruleForm.typeId
        } else {
          this.ruleForm.url = '../luoji-group-details/group-details?id=' + this.ruleForm.typeId
        }
      } else if (this.ruleForm.type === 4) {
        this.ruleForm.typeId = null
      }
      this.ruleForm.detailImg = JSON.stringify(this.ruleForm.detailImg)
      requestData(method, url, data).then((res) => {
        console.log('sub', res)
        if (res && res.code === 0) {
          this.$router.push({ name: 'banner' })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
