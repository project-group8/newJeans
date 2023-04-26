import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1682475534741 implements MigrationInterface {
    name = 'Migrations1682475534741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Prefers\` (\`preferIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`postIdx\` varchar(255) NOT NULL, \`selectprefer\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`preferIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PostLikes\` (\`postLikeIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`postIdx\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`postLikeIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ReplyComments\` (\`replyIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`postIdx\` varchar(255) NOT NULL, \`commentIdx\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`replyIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Comments\` (\`commentIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`postIdx\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`selectedTag\` varchar(255) NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`commentIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CardPosts\` (\`postIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`pollType\` varchar(255) NULL DEFAULT '', \`desc\` varchar(255) NOT NULL, \`maincategory\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`tag\` varchar(255) NULL DEFAULT '', \`imgUrl\` varchar(255) NULL DEFAULT '', \`viewCount\` int NOT NULL, \`pollTitle\` varchar(255) NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`postIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CommentLikes\` (\`commentLikeIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`postIdx\` varchar(255) NOT NULL, \`commentIdx\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`commentLikeIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ChatSaves\` (\`chatSaveIdx\` varchar(36) NOT NULL, \`chatIdx\` varchar(255) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`saveData\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`chatSaveIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Chats\` (\`chatIdx\` varchar(36) NOT NULL, \`userIdx\` varchar(255) NOT NULL, \`maxParty\` int NOT NULL, \`roomName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`chatIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`userIdx\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`nickname\` varchar(255) NOT NULL, \`level\` varchar(255) NOT NULL DEFAULT '훈수 초보', \`status\` varchar(255) NOT NULL DEFAULT 'US000001', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5da3f86a40ce07289424c734c9\` (\`nickname\`), PRIMARY KEY (\`userIdx\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Prefers\` ADD CONSTRAINT \`FK_a5f24113aa989cbe72ef49018b9\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Prefers\` ADD CONSTRAINT \`FK_b731c06b200e82c2d3e72b5bed6\` FOREIGN KEY (\`postIdx\`) REFERENCES \`CardPosts\`(\`postIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PostLikes\` ADD CONSTRAINT \`FK_98e968f857d6835134b69186cfd\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PostLikes\` ADD CONSTRAINT \`FK_56aa01d66e2da32faa6ec2b6aff\` FOREIGN KEY (\`postIdx\`) REFERENCES \`CardPosts\`(\`postIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` ADD CONSTRAINT \`FK_1437378f4ce107308d9eef4df0d\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` ADD CONSTRAINT \`FK_0bf43fb2cf0cf2f7c8a9f4c6366\` FOREIGN KEY (\`postIdx\`) REFERENCES \`CardPosts\`(\`postIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` ADD CONSTRAINT \`FK_d101ddf72cb184e8a6b02e3a3b1\` FOREIGN KEY (\`commentIdx\`) REFERENCES \`Comments\`(\`commentIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_d4cbee15c0e75a5e399d66a2c26\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_cd007a330fa395aaa98c9097e94\` FOREIGN KEY (\`postIdx\`) REFERENCES \`CardPosts\`(\`postIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` ADD CONSTRAINT \`FK_b631d4bd2cce76f2cd896f3ba57\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` ADD CONSTRAINT \`FK_8aed3d6e347b10d228554571a7c\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` ADD CONSTRAINT \`FK_396fb61ad554bb6f84bbef93d88\` FOREIGN KEY (\`commentIdx\`) REFERENCES \`Comments\`(\`commentIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` ADD CONSTRAINT \`FK_7e7478dfbf281c8991a0f1dbfa4\` FOREIGN KEY (\`postIdx\`) REFERENCES \`CardPosts\`(\`postIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_5a252d842da33f67ed376edf3e8\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` ADD CONSTRAINT \`FK_728b0200539155211d57306c40d\` FOREIGN KEY (\`chatIdx\`) REFERENCES \`Chats\`(\`chatIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Chats\` ADD CONSTRAINT \`FK_f8de00de808e24ca46b0bb10aa0\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Chats\` DROP FOREIGN KEY \`FK_f8de00de808e24ca46b0bb10aa0\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_728b0200539155211d57306c40d\``);
        await queryRunner.query(`ALTER TABLE \`ChatSaves\` DROP FOREIGN KEY \`FK_5a252d842da33f67ed376edf3e8\``);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` DROP FOREIGN KEY \`FK_7e7478dfbf281c8991a0f1dbfa4\``);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` DROP FOREIGN KEY \`FK_396fb61ad554bb6f84bbef93d88\``);
        await queryRunner.query(`ALTER TABLE \`CommentLikes\` DROP FOREIGN KEY \`FK_8aed3d6e347b10d228554571a7c\``);
        await queryRunner.query(`ALTER TABLE \`CardPosts\` DROP FOREIGN KEY \`FK_b631d4bd2cce76f2cd896f3ba57\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_cd007a330fa395aaa98c9097e94\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_d4cbee15c0e75a5e399d66a2c26\``);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` DROP FOREIGN KEY \`FK_d101ddf72cb184e8a6b02e3a3b1\``);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` DROP FOREIGN KEY \`FK_0bf43fb2cf0cf2f7c8a9f4c6366\``);
        await queryRunner.query(`ALTER TABLE \`ReplyComments\` DROP FOREIGN KEY \`FK_1437378f4ce107308d9eef4df0d\``);
        await queryRunner.query(`ALTER TABLE \`PostLikes\` DROP FOREIGN KEY \`FK_56aa01d66e2da32faa6ec2b6aff\``);
        await queryRunner.query(`ALTER TABLE \`PostLikes\` DROP FOREIGN KEY \`FK_98e968f857d6835134b69186cfd\``);
        await queryRunner.query(`ALTER TABLE \`Prefers\` DROP FOREIGN KEY \`FK_b731c06b200e82c2d3e72b5bed6\``);
        await queryRunner.query(`ALTER TABLE \`Prefers\` DROP FOREIGN KEY \`FK_a5f24113aa989cbe72ef49018b9\``);
        await queryRunner.query(`DROP INDEX \`IDX_5da3f86a40ce07289424c734c9\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`Chats\``);
        await queryRunner.query(`DROP TABLE \`ChatSaves\``);
        await queryRunner.query(`DROP TABLE \`CommentLikes\``);
        await queryRunner.query(`DROP TABLE \`CardPosts\``);
        await queryRunner.query(`DROP TABLE \`Comments\``);
        await queryRunner.query(`DROP TABLE \`ReplyComments\``);
        await queryRunner.query(`DROP TABLE \`PostLikes\``);
        await queryRunner.query(`DROP TABLE \`Prefers\``);
    }

}
