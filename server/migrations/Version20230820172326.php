<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230820172326 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE organisation (id INT AUTO_INCREMENT NOT NULL, secteur_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, INDEX IDX_E6E132B49F7E4405 (secteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE organisation ADD CONSTRAINT FK_E6E132B49F7E4405 FOREIGN KEY (secteur_id) REFERENCES secteur (id)');
        $this->addSql('ALTER TABLE user ADD organisation_id INT DEFAULT NULL, CHANGE photo photo VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6499E6B1585 FOREIGN KEY (organisation_id) REFERENCES organisation (id)');
        $this->addSql('CREATE INDEX IDX_8D93D6499E6B1585 ON user (organisation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6499E6B1585');
        $this->addSql('ALTER TABLE organisation DROP FOREIGN KEY FK_E6E132B49F7E4405');
        $this->addSql('DROP TABLE organisation');
        $this->addSql('DROP INDEX IDX_8D93D6499E6B1585 ON user');
        $this->addSql('ALTER TABLE user DROP organisation_id, CHANGE photo photo VARCHAR(255) NOT NULL');
    }
}
