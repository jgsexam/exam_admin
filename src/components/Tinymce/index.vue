<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <!-- <div class="editor-custom-btn-container">
      // 文件上传组件，已经没用
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
    </div>-->
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import uploadFile from '@/api/upload'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      }
    }
  },
  computed: {
    language () {
      return this.languageTypeList['zh']
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    },
    language () {
      this.destroyTinymce()
      this.$nextTick(() => this.initTinymce())
    }
  },
  mounted () {
    this.initTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  },
  methods: {
    initTinymce () {
      const _this = this
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        plugins: ['powerpaste', plugins],
        object_resizing: true,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'merge',// 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'merge',// propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '*[*]',        // word需要它
        paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: true,     // 插入word文档需要该属性
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        images_upload_handler (blobInfo, success, failure) {
          const formData = new FormData();
          formData.append('file', blobInfo.blob());
          uploadFile.upload(formData).then(res => {
            console.log(res.data.fileUrl)
            let fileUrl = res.data.fileUrl;
            success(fileUrl);
            return
          })
        }
      })
    },
    destroyTinymce () {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent (value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent () {
      return window.tinymce.get(this.tinymceId).getContent()
    },
    /* imageSuccessCBK (arr) { // 自己写的文件上传
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    } */
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
