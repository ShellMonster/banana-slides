#!/bin/bash
# ============================================================================
# Banana Slides 镜像源配置脚本
# ============================================================================
# 使用方法：
#   bash setup-mirrors.sh          # 自动检测地区
#   bash setup-mirrors.sh cn       # 强制使用中国源
#   bash setup-mirrors.sh global   # 强制使用国外源
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }

# 检测 IP 地区
detect_region() {
    if command -v curl &> /dev/null; then
        local country
        country=$(curl -s --max-time 5 "https://ipinfo.io/country" 2>/dev/null | tr -d '\n' || echo "")
        if [ "$country" = "CN" ]; then
            echo "CN"
            return 0
        elif [ -n "$country" ]; then
            echo "GLOBAL"
            return 0
        fi
    fi
    echo "CN"
}

# 配置中国镜像源
apply_china_mirrors() {
    log_info "配置中国镜像源..."

    # backend/Dockerfile
    if [ -f "backend/Dockerfile" ]; then
        # 备份原始文件（仅首次）
        [ -f "backend/Dockerfile.orig" ] || cp "backend/Dockerfile" "backend/Dockerfile.orig"
        # 从原始文件开始修改（确保幂等性）
        cp "backend/Dockerfile.orig" "backend/Dockerfile"

        # 1. Docker Hub 镜像（使用正则匹配任意版本）
        perl -pi -e 's|^(FROM\s+)python:|\1docker.1ms.run/python:|g' backend/Dockerfile

        # 2. ghcr.io 镜像
        perl -pi -e 's|ghcr\.io/astral-sh/uv|ghcr.nju.edu.cn/astral-sh/uv|g' backend/Dockerfile

        # 3. apt 镜像源（在 apt-get update 前插入 sed 命令）
        if ! grep -q "mirrors.aliyun.com" backend/Dockerfile; then
            perl -pi -e 'print "# 配置 apt 镜像源\nRUN sed -i \"s\@deb.debian.org\@mirrors.aliyun.com\@g\" /etc/apt/sources.list.d/debian.sources 2>/dev/null || true\n\n" if /RUN apt-get update/' backend/Dockerfile
        fi

        # 4. PyPI 镜像源（在 uv sync 前插入 ENV）
        if ! grep -q "UV_INDEX_URL" backend/Dockerfile; then
            perl -pi -e 'print "# 配置 PyPI 镜像源\nENV UV_INDEX_URL=https://mirrors.cloud.tencent.com/pypi/simple\n\n" if /RUN if \[ -f uv\.lock \]/' backend/Dockerfile
        fi
    fi

    # frontend/Dockerfile
    if [ -f "frontend/Dockerfile" ]; then
        # 备份原始文件（仅首次）
        [ -f "frontend/Dockerfile.orig" ] || cp "frontend/Dockerfile" "frontend/Dockerfile.orig"
        # 从原始文件开始修改（确保幂等性）
        cp "frontend/Dockerfile.orig" "frontend/Dockerfile"

        # 1. Docker Hub 镜像（使用正则匹配任意版本）
        perl -pi -e 's|^(FROM\s+)node:|\1docker.1ms.run/node:|g' frontend/Dockerfile
        perl -pi -e 's|^(FROM\s+)nginx:|\1docker.1ms.run/nginx:|g' frontend/Dockerfile

        # 2. npm 镜像源（在 npm install 前插入配置）
        if ! grep -q "registry.npmmirror.com" frontend/Dockerfile; then
            perl -pi -e 'print "# 配置 npm 镜像源\nRUN npm config set registry https://registry.npmmirror.com/\n\n" if /RUN npm install/' frontend/Dockerfile
        fi
    fi

    log_success "已配置中国镜像源"
}

# 恢复官方源
apply_global_mirrors() {
    log_info "恢复官方源..."

    # 从 .orig 备份恢复
    if [ -f "backend/Dockerfile.orig" ]; then
        mv "backend/Dockerfile.orig" "backend/Dockerfile"
        log_success "已恢复 backend/Dockerfile"
    fi

    if [ -f "frontend/Dockerfile.orig" ]; then
        mv "frontend/Dockerfile.orig" "frontend/Dockerfile"
        log_success "已恢复 frontend/Dockerfile"
    fi

    log_success "已恢复官方源"
}

# 显示配置摘要
show_summary() {
    local region=$1
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    if [ "$region" = "CN" ]; then
        echo -e "${CYAN}📍 当前配置: 中国镜像源${NC}"
        echo "  • Docker Hub: docker.1ms.run (1ms)"
        echo "  • ghcr.io:    ghcr.nju.edu.cn (南京大学)"
        echo "  • apt:        mirrors.aliyun.com (阿里云)"
        echo "  • PyPI:       mirrors.cloud.tencent.com (腾讯云)"
        echo "  • npm:        registry.npmmirror.com (淘宝)"
    else
        echo -e "${CYAN}📍 当前配置: 官方源${NC}"
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}下一步:${NC} docker compose up -d"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "🍌 Banana Slides 镜像源配置"
    echo ""

    local region=""
    case "${1:-}" in
        cn|CN) region="CN" ;;
        global|GLOBAL) region="GLOBAL" ;;
        "")
            log_info "检测 IP 地区..."
            region=$(detect_region)
            ;;
        *)
            echo "用法: bash setup-mirrors.sh [cn|global]"
            exit 1
            ;;
    esac

    if [ "$region" = "CN" ]; then
        apply_china_mirrors
    else
        apply_global_mirrors
    fi

    show_summary "$region"
}

main "$@"
