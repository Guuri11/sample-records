<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200510104837 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL, CHANGE surname surname VARCHAR(75) DEFAULT NULL, CHANGE address address VARCHAR(255) DEFAULT NULL, CHANGE postal_code postal_code INT DEFAULT NULL, CHANGE town town VARCHAR(255) DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL, CHANGE phone phone VARCHAR(255) DEFAULT NULL, CHANGE credit_card credit_card VARCHAR(255) DEFAULT NULL, CHANGE profile_image profile_image VARCHAR(255) DEFAULT NULL, CHANGE profile_size profile_size INT DEFAULT NULL, CHANGE header_image header_image VARCHAR(255) DEFAULT NULL, CHANGE header_size header_size INT DEFAULT NULL');
        $this->addSql('ALTER TABLE song CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE album_id album_id INT DEFAULT NULL, CHANGE video_src video_src VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE purchase ADD comments_id INT DEFAULT NULL, CHANGE user_id user_id INT DEFAULT NULL, CHANGE time time TIME DEFAULT NULL, CHANGE town town VARCHAR(255) DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE purchase ADD CONSTRAINT FK_6117D13B63379586 FOREIGN KEY (comments_id) REFERENCES comment (id)');
        $this->addSql('CREATE INDEX IDX_6117D13B63379586 ON purchase (comments_id)');
        $this->addSql('ALTER TABLE product CHANGE category_id category_id INT DEFAULT NULL, CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE discount discount DOUBLE PRECISION DEFAULT NULL, CHANGE size size VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE post CHANGE artist_id artist_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE album CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE duration duration INT DEFAULT NULL');
        $this->addSql('ALTER TABLE comment CHANGE user_id user_id INT DEFAULT NULL, CHANGE event_id event_id INT DEFAULT NULL, CHANGE product_id product_id INT DEFAULT NULL, CHANGE post_id post_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE artist CHANGE name name VARCHAR(20) DEFAULT NULL, CHANGE surname surname VARCHAR(75) DEFAULT NULL, CHANGE birth birth DATE DEFAULT NULL, CHANGE is_from is_from VARCHAR(255) DEFAULT NULL, CHANGE bio bio VARCHAR(750) DEFAULT NULL');
        $this->addSql('ALTER TABLE ticket CHANGE event_id event_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE event CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL, CHANGE ticket_quantity ticket_quantity INT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE album CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE duration duration INT DEFAULT NULL');
        $this->addSql('ALTER TABLE artist CHANGE name name VARCHAR(20) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE surname surname VARCHAR(75) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE birth birth DATE DEFAULT \'NULL\', CHANGE is_from is_from VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE bio bio VARCHAR(750) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE comment CHANGE user_id user_id INT DEFAULT NULL, CHANGE event_id event_id INT DEFAULT NULL, CHANGE product_id product_id INT DEFAULT NULL, CHANGE post_id post_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE event CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE city city VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE ticket_quantity ticket_quantity INT DEFAULT NULL');
        $this->addSql('ALTER TABLE post CHANGE artist_id artist_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product CHANGE category_id category_id INT DEFAULT NULL, CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE discount discount DOUBLE PRECISION DEFAULT \'NULL\', CHANGE size size VARCHAR(50) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE purchase DROP FOREIGN KEY FK_6117D13B63379586');
        $this->addSql('DROP INDEX IDX_6117D13B63379586 ON purchase');
        $this->addSql('ALTER TABLE purchase DROP comments_id, CHANGE user_id user_id INT DEFAULT NULL, CHANGE time time TIME DEFAULT \'NULL\', CHANGE town town VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE city city VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE song CHANGE artist_id artist_id INT DEFAULT NULL, CHANGE album_id album_id INT DEFAULT NULL, CHANGE video_src video_src VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE ticket CHANGE event_id event_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`, CHANGE surname surname VARCHAR(75) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE address address VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE postal_code postal_code INT DEFAULT NULL, CHANGE town town VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE city city VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE phone phone VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE credit_card credit_card VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE profile_image profile_image VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE profile_size profile_size INT DEFAULT NULL, CHANGE header_image header_image VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE header_size header_size INT DEFAULT NULL');
    }
}
