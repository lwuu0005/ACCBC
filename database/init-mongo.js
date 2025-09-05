// MongoDB 初始化脚本
db = db.getSiblingDB('ticket_booking');

// 创建用户
db.createUser({
  user: 'bridge_user',
  pwd: 'bridge_password',
  roles: [
    {
      role: 'readWrite',
      db: 'ticket_booking'
    }
  ]
});

// 创建集合和索引
db.createCollection('users');
db.createCollection('tickets');
db.createCollection('events');

// 创建索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.tickets.createIndex({ "eventId": 1 });
db.tickets.createIndex({ "userId": 1 });
db.events.createIndex({ "date": 1 });

print('Database initialized successfully');
