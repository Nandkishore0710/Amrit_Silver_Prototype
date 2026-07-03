db.getSiblingDB('silverkaari').createUser({
  user: 'silverkaari_user',
  pwd: process.env.MONGO_SILVERKAARI_PASS || 'silverkaari_pass',
  roles: [{ role: 'readWrite', db: 'silverkaari' }]
});

db.getSiblingDB('silverine').createUser({
  user: 'silverine_user',
  pwd: process.env.MONGO_SILVERINE_PASS || 'silverine_pass',
  roles: [{ role: 'readWrite', db: 'silverine' }]
});

print('MongoDB init: Created silverkaari and silverine users');
