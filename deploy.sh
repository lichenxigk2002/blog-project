#!/bin/bash

# 自动化部署脚本 for blogFrontend
# 适用宝塔面板，分支 deploy，pm2 进程名 blog

PROJECT_DIR="/root/blogFrontend"
BACKUP_DIR="/root/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$BACKUP_DIR/blogFrontend_backup_$TIMESTAMP"

echo "==== 开始部署 ===="

mkdir -p $BACKUP_DIR || { echo "创建备份目录失败！"; exit 1; }



cd $PROJECT_DIR || { echo "目录不存在！"; exit 1; }

# 备份当前版本（排除 node_modules 和 .next）
echo "开始备份当前版本..."
rsync -av --exclude='node_modules' --exclude='.next' ./ $CURRENT_BACKUP/ || { echo "备份失败！"; exit 1; }

echo "备份完成：$CURRENT_BACKUP"

# 部署函数
deploy() {
    # 拉取最新代码
    echo "开始拉取最新代码..."
    git fetch origin || { echo "拉取代码失败！"; return 1; }
    git reset --hard origin/deploy || { echo "重置代码失败！"; return 1; }

    # 安装依赖
    echo "开始安装依赖..."
    npm install || { echo "依赖安装失败！"; return 1; }

    # 构建前端
    echo "开始构建项目..."
    npm run build || { echo "构建失败！"; return 1; }

    # 重启 pm2 服务
    echo "开始重启服务..."
    pm2 restart blog || { echo "PM2 重启失败！"; return 1; }

    return 0
}

# 尝试部署
if deploy; then
    echo "==== 部署成功！===="
else
    echo "==== 部署失败，开始自动回滚 ===="
    bash /root/rollback.sh auto
    echo "==== 自动回滚完成 ===="
fi