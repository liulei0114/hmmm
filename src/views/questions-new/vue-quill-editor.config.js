const uploadConfig = {
  action: 'https://jsonplaceholder.typicode.com/posts/', // 必填参数 图片上传地址
  methods: 'POST', // 必填参数 图片上传方式
  name: 'file', // 必填参数 文件的参数名
  size: 1024, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon' // 可选 可上传的图片格式
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'], // 清除文本格式-----['clean']
  ['image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
]
const handlers = {
  image () {
    var self = this
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput === null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name)
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept)
      fileInput.classList.add('ql-image')
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 如果图片限制大小
        if (uploadConfig.size && fileInput.files[0].size >= uploadConfig.size * 1024) {
          fileInput.value = ''
          return
        }
        // 创建formData
        var formData = new FormData()
        formData.append(uploadConfig.name, fileInput.files[0])
        let file = fileInput.files[0]
        // 如果需要token且存在token
        if (uploadConfig.token) {
          formData.append('token', uploadConfig.token)
        }
        // 图片上传
        var xhr = new XMLHttpRequest()
        xhr.open(uploadConfig.methods, uploadConfig.action, true)
        // 上传数据成功，会触发
        xhr.onload = function (e) {
          if (xhr.status === 201) {
            let length = self.quill.getSelection().index
            let imageUrl = URL.createObjectURL(file)
            self.quill.insertEmbed(length, 'image', imageUrl)
            self.quill.setSelection(length + 1)
          }
          fileInput.value = ''
        }
        // 开始上传数据
        xhr.upload.onloadstart = function (e) {
          fileInput.value = ''
          // console.log('开始上传')
        }
        // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
        xhr.upload.onerror = function (e) {
        }
        // 上传数据完成（成功或者失败）时会触发
        xhr.upload.onloadend = function (e) {
          // console.log('上传结束')
        }
        xhr.send(formData)
      })
      this.container.appendChild(fileInput)
    }
    fileInput.click()
  }
}
export const toolbar = {
  container: toolbarOptions, // 工具栏选项
  handlers: handlers // 事件重写
}
