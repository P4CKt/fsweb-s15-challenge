const supertest = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});

test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true);
});

describe("User register", () => {
  it("[1] Register gerçekleşiyor mu ?", async () => {
    let sampleUser = {
      username: "p4ck6",
      password: "1234",
      role_name: "user",
    };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.user_id).not.toBeNull();
  });
  it("[2] username eksik ise hata veriyor mu ?", async () => {
    let sampleUser = {
      password: "1234",
      role_name: "user",
    };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/username/);
  });
  it("[3] Password Hashlenmiş şekilde geliyor mu?", async () => {
    let sampleUser = {
      username: "p4ck7",
      password: "1234",
      role_name: "user",
    };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.password).toHaveLength(60);
  });
  it("[4] Role geçersiz değer girilirse role user oluyor mu ?  ", async () => {
    let sampleUser = {
      username: "p4ck8",
      password: "1234",
      role_name: "asdasda",
    };
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.role_name).toBe("user");
  });
});
describe("User Login", () => {
  it("[5] Login yapılabiliyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "1234" };

    const register = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);
    register;
    const res = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/p4ck8/);
  });
  it("[6] Yanlış şifrede 401 dönüyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "123s4" };
    const res = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    expect(res.status).toBe(401);
  });
  it("[7] Admin olmayan kullanıcı bilmeceleri görebiliyor mu?", async () => {
    let sampleUser = { username: "p4ck8", password: "1234" };

    const register = await supertest(server)
      .post("/api/auth/register")
      .send(sampleUser);
    register;
    const login = await supertest(server)
      .post("/api/auth/login")
      .send(sampleUser);
    const res = await supertest(server)
      .get("/api/bilmeceler")
      .set("authorization", login.body.token);
    expect(res.body.message).toBe("bu alan Mugglelar için uygun değildir.");
  });
});
