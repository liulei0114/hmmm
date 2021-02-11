export default {
  data () {
    return {
      pageInfo: {
        page: 1,
        pagesize: 10,
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageInfo.pagesize = pageSize
      this.fetchDataList()
    },
    handleCurrentChange (page) {
      this.pageInfo.page = page
      this.fetchDataList()
    }
  }
}
