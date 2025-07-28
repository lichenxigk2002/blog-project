#!/bin/bash

# 加载环境变量（解决 GitHub Actions 环境问题）
source ~/.bashrc
source ~/.profile

# 回滚脚本 for blogFrontend
BACKUP_DIR="/root/backups"
PROJECT_DIR="/root/blogFrontend"

# 检查是否有参数传入（自动模式）
if [ "$1" = "auto" ]; then
    echo "==== 自动回滚模式 ===="
    
    # 获取最新的备份
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | grep "blogFrontend_backup_" | head -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        echo "没有找到可用的备份！"
        exit 1
    fi
    
    BACKUP_NAME="$LATEST_BACKUP"
    echo "自动选择最新备份：$BACKUP_NAME"
else
    # 手动模式
    echo "==== 可用的备份 ===="
    ls -la $BACKUP_DIR

    echo ""
    read -p "请输入要回滚的备份名称（如：blogFrontend_backup_20241201_143022）: " BACKUP_NAME

    if [ ! -d "$BACKUP_DIR/$BACKUP_NAME" ]; then
        echo "备份不存在！"
        exit 1
    fi
fi

echo "开始回滚到 $BACKUP_NAME..."

# 停止当前服务
echo "停止当前服务..."
pm2 stop blog || { echo "停止服务失败！"; exit 1; }

# 备份当前版本（防止回滚失败）
echo "备份当前版本..."
CURRENT_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$BACKUP_DIR/current_before_rollback_$CURRENT_TIMESTAMP"
mkdir -p $CURRENT_BACKUP || { echo "创建当前备份目录失败！"; exit 1; }

cd $PROJECT_DIR || { echo "项目目录不存在！"; exit 1; }
rsync -av --exclude='node_modules' --exclude='.next' ./ $CURRENT_BACKUP/ || { echo "备份当前版本失败！"; exit 1; }

# 删除当前文件（保留 node_modules 和 .next）
echo "删除当前文件..."
find . -mindepth 1 -maxdepth 1 ! -name 'node_modules' ! -name '.next' -exec rm -rf {} + || { echo "删除当前文件失败！"; exit 1; }

# 恢复备份
echo "恢复备份文件..."
rsync -av "$BACKUP_DIR/$BACKUP_NAME/" ./ || { echo "恢复备份失败！"; exit 1; }

# 重新安装依赖和构建
echo "重新安装依赖..."
npm install || { echo "重新安装依赖失败！"; exit 1; }

echo "重新构建项目..."
npm run build || { echo "重新构建失败！"; exit 1; }

# 重启服务
echo "重启服务..."
pm2 start blog || { echo "启动服务失败！"; exit 1; }

echo "==== 回滚完成！===="