<template>
  <div class="QuestionDetailWrap">
    <div class="q_head">
      <div>【题型】：{{questionInfo.questionType | filterQuestionType}}</div>
      <div>【编号】：{{questionInfo.id}}</div>
      <div>【难度】：{{questionInfo.difficulty | filterDifficulty}}</div>
      <div>【标签】：{{questionInfo.tags}}</div>
      <div>【学科】：{{questionInfo.subjectName}}</div>
      <div>【目录】：{{questionInfo.directoryName}}</div>
      <div>【方向】：{{questionInfo.direction}}</div>
    </div>
    <hr />
    <div class="tigan">
      <div>【题干】：</div>
      <div v-html="questionInfo.question" style="color:blue"></div>
      <div v-if="questionInfo.questionType !== '3'">
        <div>
          <span>{{questionInfo.questionType | filterQuestionType}}</span>
          <span>选项：（以下选中的选项为正确答案）</span>
        </div>
        <div>
          <el-radio-group :value="1">
            <div v-for="item in questionInfo.options" :key="item.id" style="margin: 15px 0">
              <el-radio :label="item.isRight">{{item.title}}</el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
    </div>
    <hr />
    <div class="answer">
      <span>【参考答案】：</span>
      <el-button type="danger" size="small" @click="handleVideoShow">视频答案浏览</el-button>
      <div v-show="isShowVideo" style="width:400px;height:300px">
        <video
          ref="video"
          style="width:100%;height:100%"
          controls="controls"
          :src="questionInfo.videoURL"
        ></video>
      </div>
    </div>
    <hr />
    <div class="flexC">
      <span>【答案解析】：</span>
      <div v-html="questionInfo.answer"></div>
    </div>
    <hr />
    <div>
      <span>【题目备注】：{{questionInfo.remarks}}</span>
    </div>
    <div style="text-align: right;">
      <el-button style="textAlian:right" type="primary" @click="cancleDialog">关 闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowVideo: false
    }
  },
  props: {
    questionInfo: {
      type: Object,
      default: () => {}
    },
    questionDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleVideoShow () {
      if (this.isShowVideo) {
        this.$refs.video.pause()
      } else {
        this.$refs.video.play()
      }
      this.isShowVideo = !this.isShowVideo
    },
    cancleDialog () {
      if (this.$refs.video.played) {
        this.$refs.video.pause()
      }
      this.$emit('update:visible', false)
    }
  },
  filters: {
    filterQuestionType (type) {
      switch (type) {
        case '1': {
          return '单选题'
        }
        case '2': {
          return '多选题'
        }
        case '3': {
          return '简答题'
        }
      }
    },
    filterDifficulty (type) {
      switch (type) {
        case '1': {
          return '简单'
        }
        case '2': {
          return '一般'
        }
        case '3': {
          return '困难'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.QuestionDetailWrap {
  width: 100%;
  .q_head {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    div {
      width: 25%;
      margin-bottom: 15px;
    }
  }
}
</style>
