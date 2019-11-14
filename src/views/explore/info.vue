<template>
  <div class="page">
    <h3 v-if="!addOrEdit">{{ $t('content.add') }}</h3>
    <h3 v-if="addOrEdit">{{ $t('content.edit') }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('content.title')"
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          style="width:50%"
          :placeholder="$t('content.titleAlert')"
        />
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
      <el-form-item
        :label="$t('content.listImg')"
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
        <span class="sizeInfo">建议尺寸300*300</span>
      </el-form-item>
      <el-form-item
        :label="$t('content.detalisImg')"
        required
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
      <el-form-item
        :label="$t('content.detalis')"
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
  name: 'ExploreInfo',
  components: {
    Tinymce
  },
  data() {
    return {
      API: {
        content: 'content/'
      },
      upUrl: defaultSettings.baseURL + defaultSettings.uploadUrl,
      theme: false,
      addOrEdit: null,
      dialogVisible: false,
      dialogImageUrl: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        'title': null, // 标题
        'detailImg': [], // 详情图片
        'listImg': null, // 列表图片
        'status': 2, // 1上架 2下架
        'sort': 1,
        'description': null
      },
      rules: {
        title: [
          { required: true, message: 'Please enter the content title', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: 'Please choose content sort', trigger: 'change' }
        ]
      },
      sortArr: [], // 排序数据
      fileList: []
    }
  },
  created() {
    this.addOrEdit = !!this.$route.query.id
    console.log(this.addOrEdit)
    this.setSort()
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.content + this.$route.query.id)
    }
  },
  methods: {
    // 探索列表图
    handleAvatarSuccess(res, file) {
      this.ruleForm.listImg = res.data
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
      for (const i in this.ruleForm.detailImg) {
        console.log(this.ruleForm.detailImg[ i ])
        if (this.ruleForm.detailImg[ i ] === file.url) {
          this.ruleForm.detailImg.splice(i, 1)
        }
      }
    },
    // 商品图片 显示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      this.ruleForm.detailImg.push(this.dialogImageUrl)
    },
    // 商品图片 多图
    handlePictureSuccess(file, fileList) {
      console.log('上传成功', file)
      this.ruleForm.detailImg.push(file.data)
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
          this.ruleForm.detailImg = JSON.parse(res.data.detailImg)
          for (const i in this.ruleForm.detailImg) {
            this.fileList.push({ name: i, url: this.ruleForm.detailImg[ i ] })
          }
        }
      })
    },
    actions(action) {
      console.log(action)
      switch (action) {
        case 'cancel':
          this.$router.push({ name: 'explore' })
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
            this.sub('PUT', this.API.content, this.ruleForm)
          } else {
            delete this.ruleForm[ 'id' ]
            this.sub('POST', this.API.content, this.ruleForm)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sub(method, url, data) {
      console.log('--sub--', data)
      this.ruleForm.detailImg = JSON.stringify(this.ruleForm.detailImg)
      requestData(method, url, data).then((res) => {
        console.log('sub', res)
        if (res && res.code === 0) {
          this.$router.push({ name: 'explore' })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
