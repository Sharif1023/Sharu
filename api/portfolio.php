<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT data FROM portfolio_config WHERE id = 1 LIMIT 1');
    $stmt->execute();
    $row = $stmt->fetch();
    if ($row) {
        echo json_encode(['success' => true, 'data' => json_decode($row['data'], true)]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'No portfolio found']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Upsert portfolio_config (id = 1)
        $stmt = $pdo->prepare('SELECT id FROM portfolio_config WHERE id = 1 LIMIT 1');
        $stmt->execute();
        $exists = $stmt->fetch();

        if ($exists) {
            $stmt = $pdo->prepare('UPDATE portfolio_config SET data = :data, updated_at = CURRENT_TIMESTAMP WHERE id = 1');
            $stmt->execute([':data' => json_encode($body)]);
        } else {
            $stmt = $pdo->prepare('INSERT INTO portfolio_config (id, data) VALUES (1, :data)');
            $stmt->execute([':data' => json_encode($body)]);
        }

        // Normalize: contacts
        $stmt = $pdo->prepare('DELETE FROM contacts WHERE portfolio_id = 1');
        $stmt->execute();

        $contact = $body['contact'] ?? [];
        $stmt = $pdo->prepare('INSERT INTO contacts (portfolio_id, email, phone, whatsapp, github, linkedin, facebook, instagram) VALUES (1, :email, :phone, :whatsapp, :github, :linkedin, :facebook, :instagram)');
        $stmt->execute([
            ':email' => $contact['email'] ?? null,
            ':phone' => $contact['phone'] ?? null,
            ':whatsapp' => $contact['whatsapp'] ?? null,
            ':github' => $contact['github'] ?? null,
            ':linkedin' => $contact['linkedin'] ?? null,
            ':facebook' => $contact['facebook'] ?? null,
            ':instagram' => $contact['instagram'] ?? null,
        ]);

        // menu_names
        $stmt = $pdo->prepare('DELETE FROM menu_names WHERE portfolio_id = 1');
        $stmt->execute();
        $menuNames = $body['menuNames'] ?? ['public' => [], 'admin' => []];
        $stmt = $pdo->prepare('INSERT INTO menu_names (portfolio_id, public, admin) VALUES (1, :public, :admin)');
        $stmt->execute([':public' => json_encode($menuNames['public'] ?? []), ':admin' => json_encode($menuNames['admin'] ?? [])]);

        // projects
        $stmt = $pdo->prepare('DELETE FROM projects WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['projects'])) {
            $ps = $pdo->prepare('INSERT INTO projects (portfolio_id, title, description, category, tech, image_url, hover_image_url, live_url, badge) VALUES (1, :title, :description, :category, :tech, :image_url, :hover_image_url, :live_url, :badge)');
            foreach ($body['projects'] as $p) {
                $ps->execute([
                    ':title' => $p['title'] ?? '',
                    ':description' => $p['description'] ?? null,
                    ':category' => $p['category'] ?? null,
                    ':tech' => isset($p['tech']) ? json_encode($p['tech']) : null,
                    ':image_url' => $p['imageUrl'] ?? null,
                    ':hover_image_url' => $p['hoverImageUrl'] ?? null,
                    ':live_url' => $p['liveUrl'] ?? null,
                    ':badge' => $p['badge'] ?? null,
                ]);
            }
        }

        // services
        $stmt = $pdo->prepare('DELETE FROM services WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['services'])) {
            $ps = $pdo->prepare('INSERT INTO services (portfolio_id, title, description, icon_type) VALUES (1, :title, :description, :icon_type)');
            foreach ($body['services'] as $s) {
                $ps->execute([':title' => $s['title'] ?? '', ':description' => $s['description'] ?? null, ':icon_type' => $s['iconType'] ?? 'code']);
            }
        }

        // gallery
        $stmt = $pdo->prepare('DELETE FROM gallery WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['gallery'])) {
            $ps = $pdo->prepare('INSERT INTO gallery (portfolio_id, title, description, image_url, metadata) VALUES (1, :title, :description, :image_url, :metadata)');
            foreach ($body['gallery'] as $g) {
                $ps->execute([':title' => $g['title'] ?? '', ':description' => $g['description'] ?? null, ':image_url' => $g['imageUrl'] ?? null, ':metadata' => isset($g['metadata']) ? json_encode($g['metadata']) : null]);
            }
        }

        // media_library
        $stmt = $pdo->prepare('DELETE FROM media_library WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['mediaLibrary'])) {
            $ps = $pdo->prepare('INSERT INTO media_library (portfolio_id, url) VALUES (1, :url)');
            foreach ($body['mediaLibrary'] as $m) {
                $ps->execute([':url' => $m]);
            }
        }

        // skills
        $stmt = $pdo->prepare('DELETE FROM skills WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['about']['skills'])) {
            $ps = $pdo->prepare('INSERT INTO skills (portfolio_id, name, level) VALUES (1, :name, :level)');
            foreach ($body['about']['skills'] as $s) {
                $ps->execute([':name' => $s['name'] ?? '', ':level' => $s['level'] ?? 0]);
            }
        }

        // education
        $stmt = $pdo->prepare('DELETE FROM education WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['about']['education'])) {
            $ps = $pdo->prepare('INSERT INTO education (portfolio_id, degree, school, sort_index) VALUES (1, :degree, :school, :sort_index)');
            foreach ($body['about']['education'] as $i => $e) {
                $ps->execute([':degree' => $e['degree'] ?? '', ':school' => $e['school'] ?? '', ':sort_index' => $i]);
            }
        }

        // timeline
        $stmt = $pdo->prepare('DELETE FROM timeline WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['about']['timeline'])) {
            $ps = $pdo->prepare('INSERT INTO timeline (portfolio_id, year, description, sort_index) VALUES (1, :year, :description, :sort_index)');
            foreach ($body['about']['timeline'] as $i => $t) {
                $ps->execute([':year' => $t['year'] ?? '', ':description' => $t['description'] ?? '', ':sort_index' => $i]);
            }
        }

        // custom_links
        $stmt = $pdo->prepare('DELETE FROM custom_links WHERE portfolio_id = 1');
        $stmt->execute();
        if (!empty($body['contact']['customLinks'])) {
            $ps = $pdo->prepare('INSERT INTO custom_links (portfolio_id, name, url) VALUES (1, :name, :url)');
            foreach ($body['contact']['customLinks'] as $l) {
                $ps->execute([':name' => $l['name'] ?? '', ':url' => $l['url'] ?? '']);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
