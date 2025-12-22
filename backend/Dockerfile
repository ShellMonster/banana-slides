# ============================================================================
# Banana Slides 后端 Dockerfile
# ============================================================================
# 支持镜像源切换，通过 ARG 参数控制：
#   - APT_MIRROR: Debian apt 镜像源
#   - UV_IMAGE: uv 工具的 Docker 镜像地址
#   - PYPI_MIRROR: Python PyPI 镜像源
#
# 使用方法：
#   1. 自动配置：运行 bash setup-mirrors.sh 后执行 docker compose up -d
#   2. 手动指定：docker compose build --build-arg APT_MIRROR=mirrors.aliyun.com
# ============================================================================

# -----------------------------------------------------------------------------
# 第一阶段：获取 uv 工具（支持镜像源切换）
# -----------------------------------------------------------------------------
ARG UV_IMAGE=ghcr.io/astral-sh/uv:latest
FROM ${UV_IMAGE} AS uv-source

# -----------------------------------------------------------------------------
# 第二阶段：构建主镜像
# -----------------------------------------------------------------------------
FROM python:3.10-slim

# 接收构建参数
ARG APT_MIRROR=deb.debian.org
ARG PYPI_MIRROR=https://pypi.org/simple/

# 设置工作目录
WORKDIR /app

# 配置 apt 镜像源（支持国内加速）
# 兼容 Debian 12 (bookworm) 的 sources.list.d 格式
RUN if [ "$APT_MIRROR" != "deb.debian.org" ]; then \
        echo "配置 apt 镜像源: $APT_MIRROR"; \
        sed -i "s@deb.debian.org@${APT_MIRROR}@g" /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
        sed -i "s@deb.debian.org@${APT_MIRROR}@g" /etc/apt/sources.list 2>/dev/null || true; \
    fi

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 从第一阶段复制 uv 工具
COPY --from=uv-source /uv /usr/local/bin/uv
RUN chmod +x /usr/local/bin/uv

# 配置 PyPI 镜像源（供 uv 使用）
ENV UV_INDEX_URL=${PYPI_MIRROR}

# 复制项目配置文件
COPY pyproject.toml ./
COPY uv.lock* ./

# 安装 Python 依赖
# 如果有 uv.lock 文件则使用 --frozen，否则生成新的锁定文件
RUN if [ -f uv.lock ]; then \
        uv sync --frozen; \
    else \
        uv sync; \
    fi

# 复制后端代码
COPY backend/ ./backend/

# 创建必要的目录
RUN mkdir -p /app/backend/instance /app/uploads

ENV PYTHONPATH=/app
ENV FLASK_APP=backend/app.py

# 暴露端口
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ["sh", "-c", "curl -f http://localhost:${PORT:-5000}/health || exit 1"]

# 启动应用
CMD ["sh", "-c", "uv run --directory backend alembic upgrade head && uv run --directory backend python app.py"]
