#!/bin/bash

# 自动化部署脚本 for blogFrontend
# 适用宝塔面板，分支 deploy，pm2 进程名 blog

PROJECT_DIR="/root/blogFrontend"
PROJECT_ROOT="/root/demo"  # 项目根目录
BACKUP_DIR="/root/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$BACKUP_DIR/blogFrontend_backup_$TIMESTAMP"

echo "==== 开始部署 ===="

mkdir -p $BACKUP_DIR || { echo "创建备份目录失败！"; exit 1; }

# 备份当前版本（排除 node_modules 和 .next）
if [ -d "$PROJECT_DIR" ]; then
    echo "开始备份当前版本..."
    rsync -av --exclude='node_modules' --exclude='.next' $PROJECT_DIR/ $CURRENT_BACKUP/ || { echo "备份失败！"; exit 1; }
    echo "备份完成：$CURRENT_BACKUP"
else
    echo "部署目录不存在，跳过备份"
fi

# 部署函数
deploy() {
    # 进入项目根目录
    cd $PROJECT_ROOT || { echo "项目根目录不存在！"; return 1; }
    
    # 拉取最新代码（直接在 demo 目录）
    echo "开始拉取最新代码..."
    git fetch origin deploy || { echo "拉取代码失败！"; return 1; }
    git checkout origin/deploy -- blogFrontend/ || { echo "拉取 blogFrontend 目录失败！"; return 1; }


    # 复制到部署位置（增量更新，保留现有文件）
    echo "开始复制前端代码..."
    rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' ./blogFrontend/ $PROJECT_DIR/ || { echo "复制代码失败！"; return 1; }

    # 进入部署目录
    cd $PROJECT_DIR || { echo "进入部署目录失败！"; return 1; }

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