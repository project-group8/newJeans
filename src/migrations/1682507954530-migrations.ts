import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682507954530 implements MigrationInterface {
    name = 'Migrations1682507954530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ChatSaves\` (\`chatSaveIdx\` varchar(36) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`room\` varchar(255) NOT NULL, \`saveData\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`chatSaveIdx\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`ChatSaves\``);
    }

}
