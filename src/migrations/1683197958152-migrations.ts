import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1683197958152 implements MigrationInterface {
    name = 'Migrations1683197958152'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`ALTER TABLE \`Chats\` ADD CONSTRAINT \`FK_f8de00de808e24ca46b0bb10aa0\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Tokens\` ADD CONSTRAINT \`FK_5e2389ba2f7642aed3dc0df4b2c\` FOREIGN KEY (\`userIdx\`) REFERENCES \`Users\`(\`userIdx\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tokens\` DROP FOREIGN KEY \`FK_5e2389ba2f7642aed3dc0df4b2c\``);
        await queryRunner.query(`ALTER TABLE \`Chats\` DROP FOREIGN KEY \`FK_f8de00de808e24ca46b0bb10aa0\``);
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
    }

}
