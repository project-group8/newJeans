import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682576791679 implements MigrationInterface {
    name = 'Migrations1682576791679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tokens\` DROP FOREIGN KEY \`FK_5e2389ba2f7642aed3dc0df4b2c\``);
        await queryRunner.query(`ALTER TABLE \`Tokens\` ADD CONSTRAINT \`FK_5e2389ba2f7642aed3dc0df4b2c\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tokens\` DROP FOREIGN KEY \`FK_5e2389ba2f7642aed3dc0df4b2c\``);
        await queryRunner.query(`ALTER TABLE \`Tokens\` ADD CONSTRAINT \`FK_5e2389ba2f7642aed3dc0df4b2c\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
