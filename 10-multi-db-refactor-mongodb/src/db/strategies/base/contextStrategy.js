const ICrud = require('../interfaces/ICrud');

class ContextStrategy  extends ICrud{
  constructor(strategy) {
    super();
    this._database = strategy;
  }
  create(item) {
    return this._database.create(item);
  }
  read(item,skip,limit) {
    return this._database.read(item,skip,limit)
  }
  update(id, item) {
    return this._database.update(id, item);
  }
  delete(id) {
    return this._database.delete(id);
  }
  IsConnected() {
    return this._database.IsConnected();
  }
  static connect() {
    return this._database.connect();
  }
  static disconnect() {
    return this._database.disconnect();
  }
}

module.exports = ContextStrategy 