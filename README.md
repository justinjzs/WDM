# WDM
Documents manager based on Web  
## Required
- [Npm](https://github.com/npm/npm)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/)

## How To Build
 - fork该Repo到自己的账户下
 - `git clone https://github.com/username/WDM` 获取副本  
 -  `git checkout dev` 切换至分支dev  
 - `npm install` 安装依赖包  
 - 进入config文件夹, 编辑dbconfig.js, 配置你的用户名，密码和数据库信息  
 - 配置完毕运行 npm run dbinit 初始化数据库  
 - 运行 `npm run test` 完成测试!  
 - 运行 `npm start` 开启服务  
 - 打开`http://localhost:3000/login`, 登陆

## BUG
- 运行npm run test 会导致第一个测试超时，原因是在运行测试前会先运行webpack打包导致超时

