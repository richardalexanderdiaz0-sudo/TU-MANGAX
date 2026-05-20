// Service Worker para TU MANGAX - Gestión de clics en notificaciones push
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Obtener la URL objetivo del payload de la notificación de manera segura
    let urlToOpen = '/';
    if (event.notification.data && event.notification.data.url) {
        urlToOpen = event.notification.data.url;
    }

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function(windowClients) {
            // Verificar si la pestaña ya está abierta
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // Si la pestaña está visible o en background, la enfocamos y navegamos
                if ('focus' in client) {
                    if (client.url.includes(urlToOpen)) {
                        return client.focus();
                    }
                    if ('navigate' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
            }
            // Si la aplicación no estaba abierta en absoluto, abrimos una nueva ventana
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
            return null;
        })
    );
});
