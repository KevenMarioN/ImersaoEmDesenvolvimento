const { deepEqual, ok, notStrictEqual } = require('assert');
const api = require('../api');
let app = {};
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktldmVuIiwiaWQiOjEsImlhdCI6MTY0ODQ5ODcxOH0.o7VoVA1PwoiNmmbB2I5grAJ3D-6Hv0hIlkTzqBF0tws";
const MOCK_HERO_CREATE = {
  nome: `Luffy-${Date.now()}`,
  poder: 'Nika Nika no mi'
}
const MOCK_HERO_STARTED = {
  nome: `Franklin-${Date.now()}`,
  poder: 'CYBORG'
}
const headers = {
  Authorization : TOKEN
}
let MOCK_ID = '';
describe('Teste for API HEROES', function () {
  this.beforeAll(async function () {
    app = await api
    const { payload } = await app.inject({
      url: '/herois',
      method: 'POST',
      headers,
      payload: MOCK_HERO_STARTED
    });
    const { _id } = JSON.parse(payload);
    MOCK_ID = _id;
  });
  it('Should be able render list', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/herois?skip=0&limit=10'
    });

    const { statusCode, payload } = result;
    const data = JSON.parse(payload);
    deepEqual(statusCode, 200);
    ok(Array.isArray(data));
  });
  it('Should be able render list with limit', async () => {
    const LIMIT_ITEM = 3;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${LIMIT_ITEM}`
    });

    const { statusCode, payload } = result;
    const data = JSON.parse(payload);
    deepEqual(statusCode, 200);
    ok(data.length === LIMIT_ITEM);
  });
  it('Should be able render error with limit', async () => {
    const LIMIT_ITEM = "kajdkshadj";
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${LIMIT_ITEM}`
    });
    deepEqual(result.statusCode, 400);
  });
  it('Should be able render list heroi specific', async () => {
    const NAME = MOCK_HERO_STARTED.nome;
    const resultSearch = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?nome=${NAME}`
    });
    
    const { statusCode, payload } = resultSearch;
    const data = JSON.parse(payload);
    ok(statusCode === 200);
    deepEqual(data[0].nome,NAME)
  });
  it('Should be able create new hero', async () => {
    const { statusCode, payload } = await app.inject({
      method: 'POST',
      url: '/herois',
      headers,
      payload: MOCK_HERO_CREATE
    });
    const { message, _id } = JSON.parse(payload);

    notStrictEqual(_id, undefined);
    deepEqual(message, "Heroi cadastrado com sucesso!");
    deepEqual(statusCode, 200);
  });
  it('Should be able return erro in method POST, if not exists nome or poder', async () => {
    const { statusCode } = await app.inject({
      method: 'POST',
      url: '/herois',
      headers
    });
    deepEqual(statusCode, 400);
  });
  it('Should be able actualization a hero', async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: 'Super Mira'
    }
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      headers,
      payload: expected
    });
    const { statusCode, payload } = result;
    ok(statusCode === 200);
    const data = JSON.parse(payload);
    deepEqual(data.message, 'Heroi atualizado com sucesso!');
  });
  it('Should be able try actualization a hero', async () => {
    const _id = `6241b1414d86c30d3c229434`;
    const expected = {
      poder: 'Super Mira'
    }
    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      headers,
      payload: expected
    });
    const { statusCode, payload } = result;
    ok(statusCode === 412);
    const data = JSON.parse(payload)
    deepEqual(data.message, 'Não encontrado no banco!');
  });
  it('Should be able delete hero', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${MOCK_ID}`
    });
    const { statusCode, payload } = result;
    ok(statusCode === 200);
    const data = JSON.parse(payload);
    deepEqual(data.message, "Heroi removido com sucesso!");

  });
  it('Should be able return error in delete hero', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/6241e9a2ae556da253a663c3`
    });
    const { statusCode, payload } = result;
    ok(statusCode === 412);
    const data = JSON.parse(payload);
    deepEqual(data.message, "ID Não encontrado no banco!");

  });
  it('Should be able return error id invalid', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/INVALID_ID`
    });
    const { statusCode, payload } = result;
    ok(statusCode === 500);
    const data = JSON.parse(payload);
    deepEqual(data.message, "An internal server error occurred");

  });
});