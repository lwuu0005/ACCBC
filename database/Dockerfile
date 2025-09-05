# MongoDB Docker 配置 (可选，建议使用 MongoDB Atlas)
FROM mongo:7.0

# 设置环境变量
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password
ENV MONGO_INITDB_DATABASE=ticket_booking

# 创建初始化脚本
COPY init-mongo.js /docker-entrypoint-initdb.d/

# 暴露端口
EXPOSE 27017
