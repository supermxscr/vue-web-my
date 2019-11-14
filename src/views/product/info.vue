<template>
  <div class="page">
    <h3 v-if="!addOrEdit">{{ $t('product.add') }}</h3>
    <h3 v-if="addOrEdit">{{ $t('product.edit') }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <!-- 标题 -->
      <el-form-item
        :label="$t('product.title')"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          style="width:50%"
          :placeholder="$t('product.titleAlert')"
        />
      </el-form-item>
      <!-- 价格 -->
      <el-form-item
        :label="$t('product.price')"
        prop="price"
      >
        <el-input
          v-model="ruleForm.price"
          style="width:50%;mergin-right:10px;"
          :placeholder="$t('product.priceAlert')"
        />
        <span>{{ $t('money') }}</span>
      </el-form-item>
      <!-- 分类 -->
      <el-form-item
        :label="$t('product.classify')"
        prop="categoryId"
      >
        <el-select
          v-model="ruleForm.categoryId"
          style="width:50%"
          :placeholder="$t('product.classifyAlert')"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 排序 -->
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
      <el-form-item
        :label="$t('product.specification')"
        prop="propertyName"
      >
        <el-input
          v-model="ruleForm.propertyName"
          style="width:50%"
          :placeholder="$t('product.specificationAlert')"
        />
      </el-form-item>
      <!-- 商品型号 -->
      <el-form-item
        :label="$t('product.productModel')"
        required
      >
        <el-input
          v-model="property"
          style="width:50%"
        />
        <el-button
          type="primary"
          @click="addShopModel"
        >添加</el-button>
      </el-form-item>
      <el-table
        :data="ruleForm.productSkuList"
        style="width: 700px;"
      >
        <el-table-column
          fixed
          label="型号"
          width="120"
          prop="property"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.property }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="价格"
          width="100"
          prop="price"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.price"
              style="width:80px;"
            />
          </template>

        </el-table-column>
        <el-table-column
          fixed
          label="库存"
          width="100"
          prop="num"
        ><template slot-scope="scope">
          <el-input
            v-model="scope.row.num"
            style="width:80px;"
          />
        </template></el-table-column>
        <el-table-column
          fixed
          label="商品编号"
          width="200"
          prop="identifier"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.identifier"
              style="width:180px;"
            />
          </template></el-table-column>
      </el-table>
      <el-form-item
        :label="$t('product.thumbnail')"
        prop="listImg"
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
        <span class="sizeInfo m-t10">建议尺寸300*300</span>
      </el-form-item>
      <el-form-item
        :label="$t('product.picture')"
        prop="img"
      >
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
          :file-list="fileList"
          :action="upUrl"
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
        <span class="sizeInfo m-t10">建议尺寸800*800</span>
      </el-form-item>
      <el-form-item :label="$t('product.details')">
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
      dialogVisible: false,
      dialogImageUrl: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        title: null, // 标题
        img: [], // 商品图片
        listImg: null, // 列表图片
        categoryId: null, // 商品分类id
        status: 2, // 1上架 2下架
        price: null, // 商品价格
        descriptio: null, // 商品描述
        propertyName: null, // 规格名
        productSkuList: [],
        sort: 1 // 排序
      },
      property: null,
      rules: {
        title: [
          { required: true, message: 'Please enter the product title', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: 'Please choose product classify', trigger: 'change' }
        ],
        price: [
          { required: true, message: 'Please enter the product price', trigger: 'blur' }
        ],
        propertyName: [
          { required: true, message: 'Please enter the product property Name', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: 'Please choose product sort', trigger: 'change' }
        ],
        listImg: [
          { required: true, message: 'Please upload product thumbnail', trigger: 'change' }
        ],
        img: [
          { required: true, message: 'Please upload product picture', trigger: 'change' }
        ]
      },
      categoryList: [], // 分类数据
      sortArr: [], // 排序数据
      fileList: []
    }
  },
  created() {
    this.addOrEdit = !!this.$route.query.id
    console.log(this.addOrEdit)
    this.getCategoryList('GET', this.API.category)
    this.setSort()
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.product + this.$route.query.id)
    }
  },
  methods: {
    // 商品缩略图
    handleAvatarSuccess(res, file) {
      console.log('上传成功', res)
      this.ruleForm.listImg = res.data
      console.log(file)
      // URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 移除图片
    handleRemove(file, fileList) {
      for (const i in this.ruleForm.img) {
        console.log(this.ruleForm.img[ i ])
        if (this.ruleForm.img[ i ] === file.url) {
          this.ruleForm.img.splice(i, 1)
        }
      }
    },
    // 商品图片 显示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      this.ruleForm.img.push(this.dialogImageUrl)
    },
    // 商品图片 多图
    handlePictureSuccess(file, fileList) {
      console.log('上传成功', file)
      this.ruleForm.img.push(file.data)
    },
    // 添加商品型号显隐
    addModel() {
      this.isModel = true
    },
    // 添加商品型号
    addShopModel() {
      const data = {
        'property': this.property,
        'num': null,
        'price': null,
        'identifier': null,
        'productId': this.$route.query.id
      }
      if (!this.addOrEdit) {
        delete data.productId
      }
      this.ruleForm.productSkuList.push(data)
    },
    // 排序
    setSort() {
      for (let i = 1; i < 11; i++) {
        this.sortArr.push(i)
      }
    },
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
    // 分类列表
    getCategoryList(method, url, data) {
      requestData(method, url, data).then((res) => {
        console.log('getCategoryList', res)
        if (res && res.code === 0) {
          this.categoryList = res.data
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
</style>
