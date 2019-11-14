module.exports = {
  /**
   * @type {string}
   * @descriptionl 项目标题
   */
  title: 'CRM',
  /**
   * @type {string}
   * @description 接口 地址
   *   罗技
   *  baseURL: 'https://logi.mchances.com/api/logitech/store/',
   *   医美
   *  baseURL: 'https://yueyue.mchances.com/api/yueyue/',
   */
  baseURL: 'https://yueyue.mchances.com/api/yueyue/',
  // baseURL: window.location.host === 'logi.mchances.com' ? 'https://logi.mchances.com/api/logitech/store/' : 'https://yueyue.mchances.com/api/yueyue/',
  // 上传地址
  uploadUrl: 'file/upload',
  /**
   * @type {string}
   * @description 用户头像
   */
  userLogo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565963677968&di=5a10a44c083a65321feae919a0b83898&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201506%2F16%2F20150616234003_ZhVX8.jpeg',
  /**
   * @type {string}
   * @description 路由栏的logo
   */
  logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565963677968&di=5a10a44c083a65321feae919a0b83898&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201506%2F16%2F20150616234003_ZhVX8.jpeg',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'

}
