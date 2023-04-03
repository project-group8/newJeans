const { sequelize } = require("./models/index.js");

async function main() {
  // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
  await sequelize.sync({ force: false, alter: true });
}

main();
