import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1723806703228 implements MigrationInterface {
    name = 'Default1723806703228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fullName" character varying NOT NULL, "phoneNumber" character varying, "address" character varying, "profilePhoto" character varying, "userId" uuid, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "author" character varying NOT NULL, "publishedDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reading_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_9e1249ecae88256aa3cf15a6315" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reading_list_books_book" ("readingListId" uuid NOT NULL, "bookId" uuid NOT NULL, CONSTRAINT "PK_1f84b5e73270b7b81583ad45336" PRIMARY KEY ("readingListId", "bookId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f615cb7866aa0c4aa6b7e5004d" ON "reading_list_books_book" ("readingListId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a26434e05aa41a980db36a2860" ON "reading_list_books_book" ("bookId") `);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reading_list" ADD CONSTRAINT "FK_1b833608d2c7b9c1e3fec4aa43c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reading_list_books_book" ADD CONSTRAINT "FK_f615cb7866aa0c4aa6b7e5004d9" FOREIGN KEY ("readingListId") REFERENCES "reading_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reading_list_books_book" ADD CONSTRAINT "FK_a26434e05aa41a980db36a2860c" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reading_list_books_book" DROP CONSTRAINT "FK_a26434e05aa41a980db36a2860c"`);
        await queryRunner.query(`ALTER TABLE "reading_list_books_book" DROP CONSTRAINT "FK_f615cb7866aa0c4aa6b7e5004d9"`);
        await queryRunner.query(`ALTER TABLE "reading_list" DROP CONSTRAINT "FK_1b833608d2c7b9c1e3fec4aa43c"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a26434e05aa41a980db36a2860"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f615cb7866aa0c4aa6b7e5004d"`);
        await queryRunner.query(`DROP TABLE "reading_list_books_book"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "reading_list"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
