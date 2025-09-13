#!/bin/bash

# 加载环境变量（解决 GitHub Actions 环境问题）
source ~/.bashrc
source ~/.profile

# 自动化部署脚本 for blogFrontend
# 适用宝塔面板，分支 deploy，pm2 进程名 blog

PROJECT_DIR="/root/blogFrontend"
PROJECT_ROOT="/root/demo"  # 项目根目录
BACKUP_DIR="/root/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$BACKUP_DIR/blogFrontend_backup_$TIMESTAMP"
MAX_BACKUPS=10  # 最大备份数量

echo "==== 开始部署 ===="

mkdir -p $BACKUP_DIR || { echo "创建备份目录失败！"; exit 1; }

# 清理旧备份函数
cleanup_old_backups() {
    echo "检查备份数量..."
    
    # 统计 blogFrontend 相关的备份数量
    local backup_count=$(find $BACKUP_DIR -maxdepth 1 -type d -name "blogFrontend_backup_*" | wc -l)
    
    echo "当前备份数量: $backup_count"
    
    if [ $backup_count -ge $MAX_BACKUPS ]; then
        echo "备份数量超过 $MAX_BACKUPS 个，开始清理最旧的备份..."
        
        # 按修改时间排序，删除最旧的备份
        find $BACKUP_DIR -maxdepth 1 -type d -name "blogFrontend_backup_*" -printf '%T@ %p\n' | \
        sort -n | \
        head -n $((backup_count - MAX_BACKUPS + 1)) | \
        while read timestamp backup_path; do
            echo "删除旧备份: $(basename $backup_path)"
            rm -rf "$backup_path"
        done
        
        echo "旧备份清理完成"
    else
        echo "备份数量未超过限制，无需清理"
    fi
}

# 备份当前版本（排除 node_modules 和 .next）
if [ -d "$PROJECT_DIR" ]; then
    echo "开始备份当前版本..."
    rsync -av --exclude='node_modules' --exclude='.next' $PROJECT_DIR/ $CURRENT_BACKUP/ || { echo "备份失败！"; exit 1; }
    echo "备份完成：$CURRENT_BACKUP"
    
    # 备份完成后清理旧备份
    cleanup_old_backups
else
    echo "部署目录不存在，跳过备份"
fi

# 部署函数
deploy() {
    # 进入项目根目录
    cd $PROJECT_ROOT || { echo "项目根目录不存在！"; return 1; }
    
    # 配置 Git 超时和重试
    git config --global http.timeout 300
    git config --global http.postBuffer 524288000
    git config --global http.lowSpeedLimit 0
    git config --global http.lowSpeedTime 999999
    
    # 拉取最新代码（只拉取 blogFrontend 目录）- 增加重试机制
    echo "开始拉取最新代码..."
    
    # 重试 3 次
    for i in {1..3}; do
        echo "尝试第 $i 次拉取代码..."
        if git fetch origin deploy; then
            echo "拉取代码成功！"
            break
        else
            echo "第 $i 次拉取失败，等待 10 秒后重试..."
            sleep 10
            if [ $i -eq 3 ]; then
                echo "拉取代码失败！已重试 3 次"
                return 1
            fi
        fi
    done
    
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