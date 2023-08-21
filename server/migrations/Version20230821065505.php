<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230821065505 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE email_notifications DROP FOREIGN KEY FK_9237A37BA76ED395');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F1CD1765A');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FB7320117');
        $this->addSql('ALTER TABLE participation_reunion DROP FOREIGN KEY FK_107E15434E9B7368');
        $this->addSql('ALTER TABLE participation_reunion DROP FOREIGN KEY FK_107E1543A76ED395');
        $this->addSql('DROP TABLE email_notifications');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE participation_reunion');
        $this->addSql('DROP TABLE reunion');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE email_notifications (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, objet VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, contenu VARCHAR(1255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, date VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, heure VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, status TINYINT(1) NOT NULL, INDEX IDX_9237A37BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, contenu VARCHAR(1000) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, date_envoi VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, heure_envoi VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, message_lu TINYINT(1) NOT NULL, fromUser_id INT NOT NULL, toUser_id INT NOT NULL, INDEX IDX_B6BD307F1CD1765A (fromUser_id), INDEX IDX_B6BD307FB7320117 (toUser_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE participation_reunion (id INT AUTO_INCREMENT NOT NULL, reunion_id INT NOT NULL, user_id INT NOT NULL, note VARCHAR(1255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, presence TINYINT(1) DEFAULT NULL, INDEX IDX_107E15434E9B7368 (reunion_id), INDEX IDX_107E1543A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE reunion (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, date VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, heure_debut VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, heure_fin VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, description VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, lien VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, annule TINYINT(1) DEFAULT NULL, raison_annulation VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE email_notifications ADD CONSTRAINT FK_9237A37BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1CD1765A FOREIGN KEY (fromUser_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FB7320117 FOREIGN KEY (toUser_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE participation_reunion ADD CONSTRAINT FK_107E15434E9B7368 FOREIGN KEY (reunion_id) REFERENCES reunion (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE participation_reunion ADD CONSTRAINT FK_107E1543A76ED395 FOREIGN KEY (user_id) REFERENCES droit_acces (id) ON DELETE CASCADE');
    }
}
