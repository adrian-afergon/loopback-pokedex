db.createUser({
  user: 'pokemon',
  pwd: 'pokemon',
  roles: [{role: 'readWrite', db: 'pokemon'}],
});
