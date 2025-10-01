-- =============================================================================
-- SCHEMA BASE DE DONNÉES - METEO STATUS DASHBOARD
-- Description: Structure complète pour remplacer les données mock/CSV
-- Version: 1.0.0
-- Date: 2025-09-30
-- =============================================================================

-- Suppression des tables si elles existent (pour réinitialisation)
DROP TABLE IF EXISTS `titan_tickets`;
DROP TABLE IF EXISTS `titan_sessions`;
DROP TABLE IF EXISTS `market_data_operations`;
DROP TABLE IF EXISTS `market_data_companies`;
DROP TABLE IF EXISTS `titan_services`;
DROP TABLE IF EXISTS `system_status_history`;
DROP TABLE IF EXISTS `audit_logs`;

-- =============================================================================
-- TABLE 1: market_data_companies
-- Description: Entreprises utilisant les données de marché
-- =============================================================================
CREATE TABLE `market_data_companies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Code unique entreprise',
  `company_name` VARCHAR(255) NOT NULL COMMENT 'Nom complet entreprise',
  `status` ENUM('SUCCESS', 'WARNING', 'ERROR', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
  `total_operations` INT NOT NULL DEFAULT 0 COMMENT 'Nombre total opérations',
  `last_update` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_last_update` (`last_update`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Entreprises avec données de marché';

-- =============================================================================
-- TABLE 2: market_data_operations
-- Description: Opérations détaillées par entreprise
-- =============================================================================
CREATE TABLE `market_data_operations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT NOT NULL,
  `operation_type` VARCHAR(50) NOT NULL COMMENT 'FXCROSS, PTSWAP, etc.',
  `devise1` VARCHAR(10) NOT NULL COMMENT 'Devise principale',
  `devise2` VARCHAR(10) NULL COMMENT 'Devise secondaire (FXCROSS/PTSWAP)',
  `type_recuperation` VARCHAR(50) NOT NULL COMMENT 'Type récupération données',
  `last_market_data_update` DATETIME NOT NULL COMMENT 'Dernière MAJ données',
  `status` ENUM('SUCCESS', 'WARNING', 'ERROR', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
  `error_message` TEXT NULL COMMENT 'Message erreur si applicable',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `market_data_companies`(`id`) ON DELETE CASCADE,
  INDEX `idx_company_type` (`company_id`, `operation_type`),
  INDEX `idx_status` (`status`),
  INDEX `idx_last_update` (`last_market_data_update`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Détail des opérations Market Data par entreprise';

-- =============================================================================
-- TABLE 3: titan_services
-- Description: Services TITAN (authentification, API, etc.)
-- =============================================================================
CREATE TABLE `titan_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Code unique service',
  `service_name` VARCHAR(255) NOT NULL COMMENT 'Nom du service',
  `service_type` ENUM('API', 'AUTH', 'DATABASE', 'CACHE', 'OTHER') NOT NULL,
  `status` ENUM('operational', 'degraded', 'outage', 'maintenance') NOT NULL DEFAULT 'operational',
  `uptime_percentage` DECIMAL(5,2) NOT NULL DEFAULT 100.00 COMMENT 'Pourcentage uptime',
  `last_check` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `response_time_ms` INT NULL COMMENT 'Temps de réponse en ms',
  `description` TEXT NULL,
  `dependencies` JSON NULL COMMENT 'Liste des services dépendants',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_type` (`service_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Services TITAN et leur statut';

-- =============================================================================
-- TABLE 4: titan_sessions
-- Description: Sessions actives Oracle/TITAN
-- =============================================================================
CREATE TABLE `titan_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `timestamp` DATETIME NOT NULL COMMENT 'Horodatage',
  `active_sessions` INT NOT NULL DEFAULT 0 COMMENT 'Nombre sessions actives',
  `cpu_usage_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Utilisation CPU %',
  `memory_usage_mb` INT NULL COMMENT 'Mémoire utilisée (MB)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Métriques sessions Oracle/TITAN';

-- =============================================================================
-- TABLE 5: titan_tickets
-- Description: Tickets Zendesk/Support
-- =============================================================================
CREATE TABLE `titan_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Numéro ticket',
  `status` ENUM('nouveau', 'ouvert', 'en_attente', 'resolu', 'ferme') NOT NULL DEFAULT 'nouveau',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre du ticket',
  `description` TEXT NULL,
  `assignee` VARCHAR(100) NULL COMMENT 'Personne assignée',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` DATETIME NULL,
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tickets support Zendesk';

-- =============================================================================
-- TABLE 6: system_status_history
-- Description: Historique des changements de statut
-- =============================================================================
CREATE TABLE `system_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entity_type` ENUM('company', 'service', 'operation') NOT NULL,
  `entity_id` INT NOT NULL COMMENT 'ID de l''entité (company_id, service_id, etc.)',
  `old_status` VARCHAR(50) NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `changed_by` VARCHAR(100) NULL COMMENT 'Utilisateur/Système',
  `change_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historique des changements de statut';

-- =============================================================================
-- TABLE 7: audit_logs
-- Description: Logs d'audit pour traçabilité
-- =============================================================================
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL COMMENT 'Action effectuée',
  `entity_type` VARCHAR(50) NULL,
  `entity_id` INT NULL,
  `user_id` VARCHAR(100) NULL,
  `ip_address` VARCHAR(45) NULL,
  `details` JSON NULL COMMENT 'Détails additionnels',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_action` (`action`),
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Logs d''audit pour traçabilité';

-- =============================================================================
-- DONNÉES DE TEST (SEED DATA)
-- =============================================================================

-- Insertion entreprises Market Data
INSERT INTO `market_data_companies` 
  (`company_code`, `company_name`, `status`, `total_operations`, `last_update`) 
VALUES
  ('COMPANY_A', 'Company Alpha', 'SUCCESS', 15, NOW()),
  ('COMPANY_B', 'Company Beta', 'WARNING', 8, NOW() - INTERVAL 2 HOUR),
  ('COMPANY_C', 'Company Gamma', 'SUCCESS', 23, NOW() - INTERVAL 30 MINUTE),
  ('COMPANY_D', 'Company Delta', 'ERROR', 5, NOW() - INTERVAL 1 DAY),
  ('COMPANY_E', 'Company Epsilon', 'SUCCESS', 12, NOW() - INTERVAL 10 MINUTE);

-- Insertion opérations Market Data pour Company A
INSERT INTO `market_data_operations` 
  (`company_id`, `operation_type`, `devise1`, `devise2`, `type_recuperation`, `last_market_data_update`, `status`) 
VALUES
  (1, 'FXCROSS', 'EUR', 'USD', 'AUTO', NOW(), 'SUCCESS'),
  (1, 'FXCROSS', 'GBP', 'JPY', 'AUTO', NOW(), 'SUCCESS'),
  (1, 'PTSWAP', 'USD', 'CHF', 'MANUAL', NOW(), 'WARNING'),
  (1, 'SPOT', 'EUR', NULL, 'AUTO', NOW(), 'SUCCESS'),
  (1, 'FORWARD', 'USD', NULL, 'AUTO', NOW(), 'SUCCESS');

-- Insertion opérations Market Data pour autres companies
INSERT INTO `market_data_operations` 
  (`company_id`, `operation_type`, `devise1`, `devise2`, `type_recuperation`, `last_market_data_update`, `status`) 
SELECT 
  c.id,
  CASE (RAND() * 4)
    WHEN 0 THEN 'FXCROSS'
    WHEN 1 THEN 'PTSWAP'
    WHEN 2 THEN 'SPOT'
    ELSE 'FORWARD'
  END,
  ELT(1 + FLOOR(RAND() * 5), 'EUR', 'USD', 'GBP', 'JPY', 'CHF'),
  CASE 
    WHEN (RAND() * 4) < 2 THEN ELT(1 + FLOOR(RAND() * 5), 'EUR', 'USD', 'GBP', 'JPY', 'CHF')
    ELSE NULL
  END,
  ELT(1 + FLOOR(RAND() * 2), 'AUTO', 'MANUAL'),
  NOW() - INTERVAL FLOOR(RAND() * 24) HOUR,
  ELT(1 + FLOOR(RAND() * 4), 'SUCCESS', 'SUCCESS', 'WARNING', 'ERROR')
FROM `market_data_companies` c
WHERE c.id > 1
LIMIT 50;

-- Insertion services TITAN
INSERT INTO `titan_services` 
  (`service_code`, `service_name`, `service_type`, `status`, `uptime_percentage`, `response_time_ms`, `description`) 
VALUES
  ('AUTH_API', 'Authentication API', 'AUTH', 'operational', 99.95, 45, 'Service d''authentification TITAN'),
  ('MARKET_API', 'Market Data API', 'API', 'operational', 99.80, 120, 'API de récupération données marché'),
  ('ORACLE_DB', 'Oracle Database', 'DATABASE', 'operational', 99.99, 10, 'Base de données principale'),
  ('REDIS_CACHE', 'Redis Cache', 'CACHE', 'operational', 99.90, 5, 'Cache distribué Redis'),
  ('PAYMENT_API', 'Payment Processing', 'API', 'degraded', 98.50, 250, 'API de traitement paiements');

-- Insertion sessions TITAN (24 dernières heures, 1 point toutes les 30 minutes)
INSERT INTO `titan_sessions` (`timestamp`, `active_sessions`, `cpu_usage_percent`, `memory_usage_mb`)
SELECT 
  NOW() - INTERVAL (48 - n) * 30 MINUTE AS timestamp,
  80 + FLOOR(RAND() * 60) AS active_sessions,
  35.00 + (RAND() * 30.00) AS cpu_usage_percent,
  2048 + FLOOR(RAND() * 1024) AS memory_usage_mb
FROM (
  SELECT @row := @row + 1 AS n
  FROM (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
       (SELECT 0 UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
       (SELECT @row := 0) r
  LIMIT 48
) numbers;

-- Insertion tickets Zendesk
INSERT INTO `titan_tickets` 
  (`ticket_number`, `status`, `priority`, `title`, `assignee`) 
VALUES
  ('TKT-001', 'nouveau', 'high', 'Erreur connexion Market Data', NULL),
  ('TKT-002', 'ouvert', 'medium', 'Performance lente FXCROSS', 'Jean Dupont'),
  ('TKT-003', 'ouvert', 'low', 'Question configuration', 'Marie Martin'),
  ('TKT-004', 'en_attente', 'urgent', 'Panne Oracle Database', 'Pierre Bernard'),
  ('TKT-005', 'ouvert', 'medium', 'Timeout API Market Data', 'Jean Dupont'),
  ('TKT-006', 'nouveau', 'low', 'Demande documentation', NULL),
  ('TKT-007', 'ouvert', 'high', 'Données manquantes PTSWAP', 'Marie Martin');

-- =============================================================================
-- VUES PRATIQUES
-- =============================================================================

-- Vue agrégée pour le dashboard
CREATE OR REPLACE VIEW `v_dashboard_summary` AS
SELECT 
  (SELECT COUNT(*) FROM market_data_companies WHERE is_active = TRUE) AS total_companies,
  (SELECT COUNT(*) FROM market_data_companies WHERE status = 'SUCCESS') AS companies_success,
  (SELECT COUNT(*) FROM market_data_companies WHERE status = 'WARNING') AS companies_warning,
  (SELECT COUNT(*) FROM market_data_companies WHERE status = 'ERROR') AS companies_error,
  (SELECT COUNT(*) FROM titan_services WHERE status = 'operational') AS services_operational,
  (SELECT COUNT(*) FROM titan_tickets WHERE status IN ('nouveau', 'ouvert', 'en_attente')) AS tickets_open,
  (SELECT AVG(cpu_usage_percent) FROM titan_sessions WHERE timestamp >= NOW() - INTERVAL 1 HOUR) AS avg_cpu_last_hour,
  (SELECT AVG(active_sessions) FROM titan_sessions WHERE timestamp >= NOW() - INTERVAL 1 HOUR) AS avg_sessions_last_hour;

-- Vue détaillée des entreprises avec opérations
CREATE OR REPLACE VIEW `v_companies_with_operations` AS
SELECT 
  c.id,
  c.company_code,
  c.company_name,
  c.status,
  c.last_update,
  COUNT(o.id) AS operation_count,
  GROUP_CONCAT(DISTINCT o.operation_type ORDER BY o.operation_type) AS operation_types,
  MAX(o.last_market_data_update) AS latest_operation_update
FROM market_data_companies c
LEFT JOIN market_data_operations o ON c.id = o.company_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.company_code, c.company_name, c.status, c.last_update;

-- Vue des tickets par statut
CREATE OR REPLACE VIEW `v_tickets_by_status` AS
SELECT 
  status,
  COUNT(*) AS ticket_count,
  GROUP_CONCAT(ticket_number ORDER BY created_at DESC SEPARATOR ', ') AS ticket_numbers
FROM titan_tickets
GROUP BY status;

-- =============================================================================
-- PROCÉDURES STOCKÉES
-- =============================================================================

-- Procédure pour mettre à jour le statut d'une entreprise
DELIMITER //
CREATE PROCEDURE `sp_update_company_status`(
  IN p_company_id INT,
  IN p_new_status VARCHAR(50),
  IN p_changed_by VARCHAR(100)
)
BEGIN
  DECLARE v_old_status VARCHAR(50);
  
  -- Récupérer l'ancien statut
  SELECT status INTO v_old_status 
  FROM market_data_companies 
  WHERE id = p_company_id;
  
  -- Mettre à jour le statut
  UPDATE market_data_companies 
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_company_id;
  
  -- Ajouter dans l'historique
  INSERT INTO system_status_history 
    (entity_type, entity_id, old_status, new_status, changed_by)
  VALUES 
    ('company', p_company_id, v_old_status, p_new_status, p_changed_by);
END //
DELIMITER ;

-- Procédure pour récupérer les métriques des 24 dernières heures
DELIMITER //
CREATE PROCEDURE `sp_get_metrics_24h`()
BEGIN
  SELECT 
    timestamp,
    active_sessions,
    cpu_usage_percent,
    memory_usage_mb
  FROM titan_sessions
  WHERE timestamp >= NOW() - INTERVAL 24 HOUR
  ORDER BY timestamp ASC;
END //
DELIMITER ;

-- =============================================================================
-- INDEX ET OPTIMISATIONS SUPPLÉMENTAIRES
-- =============================================================================

-- Index pour recherche full-text (optionnel)
-- ALTER TABLE market_data_companies ADD FULLTEXT INDEX `ft_company_name` (`company_name`);
-- ALTER TABLE titan_tickets ADD FULLTEXT INDEX `ft_ticket_title` (`title`, `description`);

-- =============================================================================
-- COMMENTAIRES FINAUX
-- =============================================================================
 
-- Ce schéma fournit:
-- 1. Tables normalisées pour les données de marché
-- 2. Tables pour les services TITAN et métriques
-- 3. Historique et audit trail
-- 4. Vues pour requêtes fréquentes
-- 5. Procédures stockées pour logique métier
-- 6. Données de test pour développement

-- Prochaines étapes:
-- 1. Créer les services Node.js pour accéder à la BDD
-- 2. Adapter les hooks React existants
-- 3. Créer une API REST ou GraphQL
-- 4. Implémenter la migration des données CSV vers MySQL

-- =============================================================================
