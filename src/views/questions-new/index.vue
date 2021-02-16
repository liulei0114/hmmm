<template>
  <div id="EnterQuestion">
    <el-card class="box-card">
      <el-form ref="enterQuestionForm" :model="questionInfo" label-width="80px" :rules="rules">
        <el-form-item label="学科：" label-width="100px" prop="subjectID">
          <el-select
            v-model="questionInfo.subjectID"
            style="width:400px"
            @change="handleSubjectChange"
          >
            <el-option
              v-for="item in subjectTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录：" label-width="100px" prop="catalogID">
          <el-select v-model="questionInfo.catalogID" style="width:400px">
            <el-option
              v-for="item in subjectDirList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业：" label-width="100px" prop="enterpriseID">
          <el-select v-model="questionInfo.enterpriseID" style="width:400px">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.company"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" class="province_area" label-width="100px" required>
          <el-form-item prop="province">
            <el-select
              v-model="questionInfo.province"
              style="width:190px"
              @change="handleProvinceChange"
            >
              <el-option label="北京市" value="北京市"></el-option>
              <el-option label="天津市" value="天津市"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="city">
            <el-select v-model="questionInfo.city" style="width:190px">
              <el-option
                v-for="(area,index) in areaList"
                :key="index"
                :label="area.label"
                :value="area.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="方向：" label-width="100px" prop="direction">
          <el-select v-model="questionInfo.direction" style="width:400px">
            <el-option label="o2o" value="o2o"></el-option>
            <el-option label="外包服务" value="外包服务"></el-option>
            <el-option label="企业服务" value="企业服务"></el-option>
            <el-option label="互联网金融" value="互联网金融"></el-option>
            <el-option label="企业咨询" value="企业咨询"></el-option>
            <el-option label="互联网" value="互联网"></el-option>
            <el-option label="电子商务" value="电子商务"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型：" label-width="100px" required>
          <el-radio-group v-model="questionInfo.questionType" @change="handleChangeQuestionType">
            <el-radio label="1">单选</el-radio>
            <el-radio label="2">多选</el-radio>
            <el-radio label="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度：" label-width="100px" required>
          <el-radio-group v-model="questionInfo.difficulty">
            <el-radio label="1">简单</el-radio>
            <el-radio label="2">一般</el-radio>
            <el-radio label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干：" label-width="100px" prop="question">
          <quill-editor
            class="editor"
            v-model="questionInfo.question"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item
          label="选项："
          class="options"
          label-width="100px"
          v-if="questionInfo.questionType!=='3'"
        >
          <el-radio-group
            v-if="questionInfo.questionType==='1'"
            v-model="radioOptionCheck"
            @change="handleChangeOption"
          >
            <div
              class="flexC option"
              v-for="(option,index) in questionInfo.options"
              :key="option.code"
            >
              <el-radio :label="option.code">{{option.code}}：</el-radio>
              <el-input v-model="option.title"></el-input>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(null,option)"
                :before-upload="beforeAvatarUpload"
              >
                >
                <img v-if="option.img" :src="option.img" class="avatar" />
                <span v-else class="avatar-uploader-text">上传图片</span>
                <i class="el-icon-circle-close"></i>
              </el-upload>
              <el-button
                style="marginLeft:25px"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteAnswerOption(index,option.code)"
              ></el-button>
            </div>
          </el-radio-group>
          <el-checkbox-group
            v-if="questionInfo.questionType==='2'"
            v-model="checkboxOptionCheck"
            @change="handleChangeOption"
          >
            <div
              class="flexC option"
              v-for="(option,index) in questionInfo.options"
              :key="option.code"
            >
              <el-checkbox :label="option.code">{{option.code}}：</el-checkbox>
              <el-input v-model="option.title"></el-input>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(null,option)"
                :before-upload="beforeAvatarUpload"
              >
                >
                <img v-if="option.img" :src="option.img" class="avatar" />
                <span v-else class="avatar-uploader-text">上传图片</span>
                <i class="el-icon-circle-close"></i>
              </el-upload>
              <el-button
                style="marginLeft:25px"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteAnswerOption(index,option.code)"
              ></el-button>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button
            type="danger"
            size="mini"
            :disabled="questionInfo.questionType!=='2'"
            @click="addAnswerOption"
          >+增加选项与答案</el-button>
        </el-form-item>
        <el-form-item label="解析视频：" label-width="100px">
          <el-input v-model="questionInfo.videoURL" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="答案解析：" label-width="100px" prop="answer">
          <quill-editor
            class="editor"
            v-model="questionInfo.answer"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="题目备注：" label-width="100px" style="marginTop:80px" prop="remarks">
          <el-input
            type="textarea"
            :rows="4"
            v-model.trim="questionInfo.remarks"
            style="width:400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="试题标签：" label-width="100px" prop="tags">
          <el-select
            v-model="tags"
            multiple
            filterable
            allow-create
            default-first-option
            style="width:400px"
            placeholder="请选择试题标签"
          >
            <el-option
              v-for="item in subjectTagList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="handleQuestionOption">{{questionId ? '确认修改':'确认新增'}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getQuestionDetailApi,
  getSubjectTypeListApi,
  getSubjectDirectorysListApi,
  getSubjectTagListApi,
  getCompanyListApi,
  enterQuestionApi,
  editQuestionApi
} from '@/network/api/HmmmApi.js'
import { toolbar } from './vue-quill-editor.config'
const option = {
  code: '',
  img: '',
  isRight: '',
  title: ''
}

export default {
  data () {
    return {
      imageUrl: '',
      questionId: '',
      questionInfo: {
        answer: '', // 答案解析
        catalogID: '', // 目录
        city: '', // 地区
        difficulty: '1', // 难度
        direction: '', // 方向
        enterpriseID: '', // 企业ID
        options: [], // 选项
        province: '', // 城市
        question: '', // 问题
        questionType: '1', // 题型
        remarks: '', // 备注
        subjectID: '', // 学科
        tags: '', // 试题标签
        videoURL: '' // 解析视频
      },
      radioOptionCheck: '',
      checkboxOptionCheck: [],
      subjectTypeList: [],
      subjectDirList: [],
      subjectTagList: [],
      companyList: [],
      areaList: [],
      baseAreaList: [
        { lable: '东城区', value: '东城区' },
        { lable: '西城区', value: '西城区' },
        { lable: '朝阳区', value: '朝阳区' },
        { lable: '丰台区', value: '丰台区' },
        { lable: '石景山区', value: '石景山区' },
        { lable: '海淀区', value: '海淀区' },
        { lable: '门头沟区', value: '门头沟区' },
        { lable: '房山区', value: '房山区' },
        { lable: '通州区', value: '通州区' },
        { lable: '顺义区', value: '顺义区' },
        { lable: '昌平区', value: '昌平区' },
        { lable: '大兴区', value: '大兴区' },
        { lable: '怀柔区', value: '怀柔区' },
        { lable: '平谷区', value: '平谷区' },
        { lable: '密云区', value: '密云区' },
        { lable: '延庆区', value: '延庆区' }
      ],
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文',
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          //  富文本编辑器配置
          toolbar: toolbar
        }
      },
      rules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        city: [{ required: true, message: '请选择地区', trigger: 'change' }],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        tags: [{ required: true, message: '请选择标签', trigger: 'change' }]
      }
    }
  },
  computed: {
    tags: {
      set (value) {
        this.questionInfo.tags = value.join(',')
      },
      get () {
        return this.questionInfo.tags ? this.questionInfo.tags.split(',') : []
      }
    }
  },
  created () {
    this.questionId = this.$route.query.id
    if (this.questionId) {
      this.handlePreviewQuestion(this.questionId).then((result) => {
        this.handleSubjectChange(this.questionInfo.subjectID)
        this.questionInfo.options.forEach((e, i) => {
          if (e.isRight) {
            if (this.questionInfo.questionType === '1') {
              this.radioOptionCheck = e.code
            } else if (this.questionInfo.questionType === '2') {
              this.checkboxOptionCheck.push(e.code)
            }
          }
        })
      })
    } else {
      this.initOptionData()
    }

    this.getSubjectTypeList()
    this.getCompanyList()
  },
  methods: {
    async handlePreviewQuestion (id) {
      this.questionDialogVisible = true
      let result = await getQuestionDetailApi(id)
      this.questionInfo = result
      this.questionInfo.options.sort((a, b) => {
        return a.id - b.id
      })
    },
    async getSubjectTypeList () {
      let result = await getSubjectTypeListApi()
      this.subjectTypeList = result
    },
    async getCompanyList () {
      let result = await getCompanyListApi({ pagesize: 10000 })
      this.companyList = result.items
    },
    handleQuestionOption () {
      this.$refs.enterQuestionForm.validate(async (flag) => {
        if (flag) {
          try {
            if (this.questionId) {
              await editQuestionApi(this.questionInfo.id, this.questionInfo)
            } else {
              await enterQuestionApi(this.questionInfo)
            }
            let message = this.questionId ? '修改成功' : '新增成功'
            this.$message({
              message: message,
              type: 'success'
            })
            this.$router.push({ name: 'questions-list' })
          } catch (error) {
            this.$message({
              message: error,
              type: 'error'
            })
          }
        }
      })
    },
    handleProvinceChange (value) {
      if (value.trim() !== '' && value === '北京市') {
        this.areaList = [...this.baseAreaList]
      } else {
        this.areaList = []
        this.questionInfo.city = ''
      }
    },
    handleSubjectChange (subjecId) {
      let params = new URLSearchParams()
      params.append('subjectID', subjecId)
      Promise.all([
        getSubjectDirectorysListApi(params),
        getSubjectTagListApi(params)
      ])
        .then((result) => {
          this.subjectDirList = result[0]
          this.subjectTagList = result[1]
          if (!this.questionId) {
            this.questionInfo.catalogID = ''
            this.questionInfo.tags = ''
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    initOptionData () {
      let a = this._.clone(option)
      a.code = 'A'
      let b = this._.clone(option)
      b.code = 'B'
      let c = this._.clone(option)
      c.code = 'C'
      let d = this._.clone(option)
      d.code = 'D'
      this.questionInfo.options.push(a, b, c, d)
    },
    handleChangeOption (code) {
      if (typeof code === 'object') {
        let codeStr = code.join(',')
        // 复选框
        this.questionInfo.options.forEach((e, i) => {
          if (codeStr.indexOf(e.code) !== -1) {
            e.isRight = true
          } else {
            e.isRight = false
          }
        })
      } else {
        this.questionInfo.options.forEach((e, i) => {
          if (e.code === code) {
            e.isRight = true
          } else {
            e.isRight = false
          }
        })
      }
    },
    handleChangeQuestionType () {
      this.radioOptionCheck = ''
      this.checkboxOptionCheck = []
      this.questionInfo.options.forEach((e, i) => {
        e.isRight = false
      })
    },
    handleAvatarSuccess (option, res, file) {
      console.log(file)
      let imageUrl = URL.createObjectURL(file.raw)
      option.img = imageUrl
    },
    beforeAvatarUpload (file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    addAnswerOption () {
      let letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      let lastOption = this.questionInfo.options[
        this.questionInfo.options.length - 1
      ]
      let lastIndex = letterArr.findIndex((item) => lastOption.code === item)
      if (lastIndex === letterArr.length - 1) {
        this.$message.error('最多只能增加七个选项')
        return
      }

      let temp = this._.cloneDeep(option)
      temp.code = letterArr[lastIndex + 1]
      this.questionInfo.options.push(temp)
    },
    deleteAnswerOption (index, code) {
      if (this.questionInfo.options.length === 2) {
        this.$message.error('答案选项至少为两个')
        return
      }

      let letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      this.radioOptionCheck = ''
      this.checkboxOptionCheck = []
      for (let i = 0; i < this.questionInfo.options.length; i++) {
        let curoption = this.questionInfo.options[i]
        if (i === index && curoption.code === code) {
          // 被删除项
          this.$delete(this.questionInfo.options, i)
          i--
        } else {
          // 修改code
          curoption.code = letterArr[i]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#EnterQuestion {
  .province_area {
    /deep/ .el-form-item__content {
      display: flex;
      .el-form-item:first-child {
        margin-right: 20px;
      }
    }
  }
  .options {
    margin-top: 70px;
    .option {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }
      /deep/ .avatar-uploader {
        margin-left: 20px;
        .el-upload {
          width: 100px;
          height: 60px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          &:hover {
            border-color: #409eff;
          }
          .avatar-uploader-text {
            font-size: 14px;
            line-height: 60px;
            text-align: center;
          }
          .avatar {
            width: 100%;
            height: 100%;
          }
        }
        i {
          position: absolute;
          right: 0;
          top: 0;
          -webkit-transform: translate(50%, -50%);
          transform: translate(50%, -50%);
          background: #fff;
          font-size: 18px;
          color: #999;
        }
      }
      /deep/ .el-radio,
      .el-checkbox {
        margin-right: 10px;
      }
      /deep/ .el-input {
        width: 300px;
      }
    }
  }
  /deep/ .el-form-item__label {
    font-weight: 700;
  }
}
</style>
