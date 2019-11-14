<template>
  <div class="page">
    <h3 v-if="!addOrEdit">{{ $t('saler.add') }}</h3>
    <h3 v-if="addOrEdit">{{ $t('saler.edit') }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('user.headImg')"
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
            v-if="ruleForm.headImg"
            :src="ruleForm.headImg"
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
        :label="$t('user.name')"
        prop="nickname"
      >
        <el-input
          v-model="ruleForm.nickname"
          style="width:50%"
          :placeholder="$t('user.namePlaceholder')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('user.phone')"
        prop="identifier"
      >
        <el-input
          v-model="ruleForm.identifier"
          style="width:50%;mergin-right:10px;"
          :placeholder="$t('user.phonePlaceholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="actions('save')"
        >{{ $t('table.save') }}</el-button>
        <el-button @click="actions('cancel')">{{ $t('table.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestData } from '@/api/api'
import defaultSettings from '@/settings'
export default {
  name: 'SalerInfo',
  data() {
    return {
      API: {
        saler: 'saler/'
      },
      upUrl: defaultSettings.baseURL + defaultSettings.uploadUrl,
      theme: false,
      addOrEdit: null,
      dialogVisible: false,
      dialogImageUrl: null,
      ruleForm: {
        id: this.$route.query.id ? this.$route.query.id : null,
        identifier: null, // 手机号
        headImg: null, // 头像
        nickname: null // 姓名
      },
      rules: {
        identifier: [
          { required: true, message: 'Please enter the phone number', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'Please enter the nickname', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.addOrEdit = !!this.$route.query.id
    if (this.addOrEdit) {
      this.getDetils('GET', this.API.saler + this.$route.query.id)
    }
  },
  methods: {
    // 头像
    handleAvatarSuccess(res, file) {
      this.ruleForm.headImg = res.data
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 获取详情
    getDetils(method, url) {
      requestData(method, url).then((res) => {
        console.log('getDetils', res)
        if (res && res.code === 0) {
          this.ruleForm = res.data
        }
      })
    },
    actions(action) {
      console.log(action)
      switch (action) {
        case 'cancel':
          this.$router.push({ name: 'saler' })
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
            this.sub('PUT', this.API.saler, this.ruleForm)
          } else {
            delete this.ruleForm[ 'id' ]
            this.sub('POST', this.API.saler, this.ruleForm)
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
        if (res && res.code === 0) {
          this.$router.push({ name: 'saler' })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
