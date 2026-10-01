<?php
/**
 * Callback MyCoolPay (notification serveur-à-serveur après paiement).
 *
 * Ce fichier est servi tel quel par Hostinger (hébergement PHP standard),
 * aucun serveur Node n'est nécessaire.
 *
 * La clé privée MyCoolPay ne doit JAMAIS être codée en dur ici : ce dossier
 * est publié sur un dépôt Git public. Elle est chargée soit depuis une
 * variable d'environnement PHP (MYCOOLPAY_PRIVATE_KEY), soit depuis un
 * fichier local non versionné "secrets.local.php" à créer directement sur
 * le serveur (voir instructions en bas de ce fichier).
 */

header("Content-Type: text/plain");

function respond(int $httpStatus, string $body): void {
    http_response_code($httpStatus);
    echo $body;
    exit;
}

$privateKey = getenv("MYCOOLPAY_PRIVATE_KEY") ?: null;
if (!$privateKey) {
    $localSecrets = __DIR__ . "/secrets.local.php";
    if (is_file($localSecrets)) {
        $privateKey = require $localSecrets;
    }
}
if (!$privateKey) {
    respond(500, "KO");
}

// 1) Vérifier que la requête provient bien du serveur My-CoolPay.
$remoteIp = $_SERVER["REMOTE_ADDR"] ?? "";
if ($remoteIp !== "15.236.140.89") {
    respond(403, "KO");
}

// 2) Lire le corps de la requête (JSON ou formulaire classique).
$contentType = $_SERVER["CONTENT_TYPE"] ?? "";
if (str_contains($contentType, "application/json")) {
    $data = json_decode(file_get_contents("php://input"), true) ?: [];
} else {
    $data = $_POST;
}

$required = [
    "transaction_ref",
    "transaction_type",
    "transaction_amount",
    "transaction_currency",
    "transaction_operator",
    "transaction_status",
    "signature",
];
foreach ($required as $key) {
    if (!isset($data[$key]) || $data[$key] === "") {
        respond(400, "KO");
    }
}

// 3) Vérifier la signature MD5.
$expectedSignature = md5(
    $data["transaction_ref"] .
    $data["transaction_type"] .
    $data["transaction_amount"] .
    $data["transaction_currency"] .
    $data["transaction_operator"] .
    $privateKey
);

if (!hash_equals($expectedSignature, (string) $data["signature"])) {
    respond(400, "KO");
}

// 4) Signature valide : journaliser la transaction pour suivi manuel.
$line = implode(",", [
    date("c"),
    $data["transaction_ref"],
    $data["app_transaction_ref"] ?? "",
    $data["transaction_type"],
    $data["transaction_amount"],
    $data["transaction_currency"],
    $data["transaction_operator"],
    $data["transaction_status"],
    $data["customer_phone_number"] ?? "",
]);
file_put_contents(__DIR__ . "/payments-log.csv", $line . "\n", FILE_APPEND | LOCK_EX);

respond(200, "OK");

/**
 * INSTRUCTIONS DE DÉPLOIEMENT (à faire une seule fois, directement sur
 * Hostinger — jamais dans Git) :
 *
 * Option A — Variable d'environnement PHP (hPanel → Avancé → Configuration PHP
 * si disponible sur votre offre) : créez MYCOOLPAY_PRIVATE_KEY avec la valeur
 * de votre clé privée.
 *
 * Option B — Fichier local : via le Gestionnaire de fichiers Hostinger, créez
 * /public_html/api/secrets.local.php contenant :
 *
 *   <?php
 *   return 'VOTRE_CLE_PRIVEE_MYCOOLPAY';
 *
 * Ce fichier ne doit jamais être ajouté à Git (déjà exclu via .gitignore).
 */
