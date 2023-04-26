import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682511701186 implements MigrationInterface {
    name = 'Migrations1682511701186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`nickname\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`room\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`chatIdx\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`userIdx\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`provider\` varchar(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`selectedTag\` \`selectedTag\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollType\` \`pollType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`tag\` \`tag\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`imgUrl\` \`imgUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollTitle\` \`pollTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`level\` \`level\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`status\` \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_5a252d842da33f67ed376edf3e8\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_728b0200539155211d57306c40d\` FOREIGN KEY (\`chatIdx\`) REFERENCES \`Chats\`(\`chatIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_728b0200539155211d57306c40d\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_5a252d842da33f67ed376edf3e8\``);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'US000001'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`level\` \`level\` varchar(255) NOT NULL DEFAULT '훈수 초보'`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollTitle\` \`pollTitle\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`imgUrl\` \`imgUrl\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`tag\` \`tag\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollType\` \`pollType\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`selectedTag\` \`selectedTag\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`provider\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`userIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`chatIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`room\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`nickname\` varchar(255) NOT NULL`);
    }

}
