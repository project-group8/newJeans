import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682512220899 implements MigrationInterface {
    name = 'Migrations1682512220899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_5a252d842da33f67ed376edf3e8\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_728b0200539155211d57306c40d\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`chatIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`userIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`nickname\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`room\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`selectedTag\` \`selectedTag\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollType\` \`pollType\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`tag\` \`tag\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`imgUrl\` \`imgUrl\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollTitle\` \`pollTitle\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`level\` \`level\` varchar(255) NOT NULL DEFAULT '훈수 초보'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'US000001'`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`chatSaveIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`chatSaveIdx\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`chatSaveIdx\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`chatSaveIdx\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD PRIMARY KEY (\`chatSaveIdx\`)`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`status\` \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`level\` \`level\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollTitle\` \`pollTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`imgUrl\` \`imgUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`tag\` \`tag\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` CHANGE \`pollType\` \`pollType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`selectedTag\` \`selectedTag\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`room\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP COLUMN \`nickname\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`userIdx\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD \`chatIdx\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_728b0200539155211d57306c40d\` FOREIGN KEY (\`chatIdx\`) REFERENCES \`Chats\`(\`chatIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_5a252d842da33f67ed376edf3e8\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
