# WDM
Documents manager based on Web
基于postgres数据库，运行前请先下载该数据库  
##运行方法  
1. git clone git@github.com:justinjzs/WDM.git 获取副本  
2. git checkout dev 切换至分支dev  
3. npm install 安装依赖包  
4. 进入config文件夹, 编辑dbconfig.js, 配置你的用户名，密码和数据库信息  
5. 配置完毕运行 npm run dbinit 初始化数据库  
6. 运行 npm run test 完成测试!  
7. 运行 npm start 开启服务  
8. 打开http://localhost:3000/login, 登陆

##ERROR
1. 运行npm run test 会导致第一个测试超时，原因是在运行测试前会先运行webpack打包导致超时。

