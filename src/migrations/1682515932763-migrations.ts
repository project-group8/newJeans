import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682515932763 implements MigrationInterface {
    name = 'Migrations1682515932763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Tokens\` (\`tokenIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`token\` text NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`tokenIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Tokens\` ADD CONSTRAINT \`FK_5e2389ba2f7642aed3dc0df4b2c\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tokens\` DROP FOREIGN KEY \`FK_5e2389ba2f7642aed3dc0df4b2c\``);
        await queryRunner.query(`DROP TABLE \`Tokens\``);
    }

}
