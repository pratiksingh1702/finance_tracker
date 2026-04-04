class WebUI {
  static String get html => '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LogX Inspector</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Monaco', 'Menlo', monospace;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        
        .header {
            background: #252526;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        h1 { color: #4ec9b0; margin-bottom: 10px; }
        
        .filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .filter-group {
            background: #252526;
            padding: 15px;
            border-radius: 8px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #9cdcfe;
            font-size: 12px;
            text-transform: uppercase;
        }
        select, input {
            width: 100%;
            padding: 8px;
            background: #3c3c3c;
            border: 1px solid #4ec9b0;
            color: #d4d4d4;
            border-radius: 4px;
            font-family: inherit;
        }
        
        .log-table {
            background: #252526;
            border-radius: 8px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            text-align: left;
            padding: 12px;
            background: #2d2d30;
            color: #9cdcfe;
            cursor: pointer;
            user-select: none;
        }
        th:hover { background: #3c3c3c; }
        td {
            padding: 8px 12px;
            border-bottom: 1px solid #3c3c3c;
            font-size: 13px;
        }
        tr:hover { background: #2a2d2e; }
        
        .level-DEBUG { color: #808080; }
        .level-INFO { color: #4ec9b0; }
        .level-WARN { color: #dcdcaa; }
        .level-ERROR { color: #f48771; font-weight: bold; }
        
        .status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4ec9b0;
            color: #1e1e1e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .highlight {
            background: #f48771;
            color: #1e1e1e;
            padding: 0 2px;
            border-radius: 3px;
        }
        
        .stats {
            display: inline-block;
            margin-left: 20px;
            font-size: 14px;
            color: #4ec9b0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 LogX Inspector <span class="stats" id="logStats"></span></h1>
            <p>Real-time structured logging dashboard</p>
        </div>
        
        <div class="filters">
            <div class="filter-group">
                <label>🔍 Level Filter</label>
                <select id="levelFilter">
                    <option value="">All Levels</option>
                    <option value="DEBUG">DEBUG</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                </select>
            </div>
            <div class="filter-group">
                <label>📁 File Filter</label>
                <input type="text" id="fileFilter" placeholder="Filter by filename...">
            </div>
            <div class="filter-group">
                <label>🔎 Search</label>
                <input type="text" id="searchBox" placeholder="Search in messages...">
            </div>
        </div>
        
        <div class="log-table">
            <table id="logTable">
                <thead>
                    <tr>
                        <th onclick="sortBy('timestamp')">⏰ Timestamp</th>
                        <th onclick="sortBy('level')">📊 Level</th>
                        <th onclick="sortBy('file')">📁 File</th>
                        <th>📍 Line</th>
                        <th>⚡ Function</th>
                        <th onclick="sortBy('message')">💬 Message</th>
                    </tr>
                </thead>
                <tbody id="logBody"></tbody>
            </table>
        </div>
    </div>
    <div class="status" id="status">🟢 Connected</div>

    <script>
        let logs = [];
        let currentSort = { column: 'timestamp', direction: 'desc' };
        let ws = null;
        
        function connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `''\${protocol}//''\${window.location.host}/ws`;
            ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                document.getElementById('status').innerHTML = '🟢 Connected (Live)';
                document.getElementById('status').style.background = '#4ec9b0';
            };
            
            ws.onmessage = (event) => {
                const log = JSON.parse(event.data);
                logs.unshift(log);
                if (logs.length > 1000) logs.pop();
                renderTable();
                updateStats();
            };
            
            ws.onerror = () => {
                document.getElementById('status').innerHTML = '🔴 Disconnected (Polling)';
                document.getElementById('status').style.background = '#f48771';
                loadLogs();
            };
            
            ws.onclose = () => {
                setTimeout(connectWebSocket, 3000);
            };
        }
        
        async function loadLogs() {
            const level = document.getElementById('levelFilter').value;
            const file = document.getElementById('fileFilter').value;
            const search = document.getElementById('searchBox').value;
            
            let url = '/logs?';
            if (level) url += `level=''\${level}&`;
            if (file) url += `file=''\${encodeURIComponent(file)}&`;
            if (search) url += `search=''\${encodeURIComponent(search)}&`;
            
            const response = await fetch(url);
            logs = await response.json();
            renderTable();
            updateStats();
        }
        
        function updateStats() {
            const stats = document.getElementById('logStats');
            const levels = {
                DEBUG: logs.filter(l => l.level === 'DEBUG').length,
                INFO: logs.filter(l => l.level === 'INFO').length,
                WARN: logs.filter(l => l.level === 'WARN').length,
                ERROR: logs.filter(l => l.level === 'ERROR').length
            };
            stats.innerHTML = `Total: ''\${logs.length} | 🔵 ''\${levels.DEBUG} 🟢 ''\${levels.INFO} 🟡 ''\${levels.WARN} 🔴 ''\${levels.ERROR}`;
        }
        
        function renderTable() {
            let filtered = [...logs];
            
            const level = document.getElementById('levelFilter').value;
            const file = document.getElementById('fileFilter').value;
            const search = document.getElementById('searchBox').value;
            
            if (level) filtered = filtered.filter(l => l.level === level);
            if (file) filtered = filtered.filter(l => l.file.includes(file));
            if (search) {
                filtered = filtered.filter(l => 
                    l.message.toLowerCase().includes(search.toLowerCase())
                );
            }
            
            filtered.sort((a, b) => {
                let aVal = a[currentSort.column];
                let bVal = b[currentSort.column];
                
                if (currentSort.column === 'timestamp') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
            
            const tbody = document.getElementById('logBody');
            tbody.innerHTML = filtered.map(log => `
                <tr>
                    <td style="white-space: nowrap;">''\${new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td class="level-''\${log.level}">''\${log.level}</td>
                    <td><code>''\${log.file}</code></td>
                    <td>''\${log.line}</td>
                    <td><code>''\${log.function}</code></td>
                    <td>''\${highlightSearch(log.message)}</td>
                </tr>
            `).join('');
        }
        
        function highlightSearch(text) {
            const search = document.getElementById('searchBox').value;
            if (!search) return text;
            const regex = new RegExp(`(''\${search})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }
        
        function sortBy(column) {
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'desc';
            }
            renderTable();
        }
        
        let pollInterval;
        function startPolling() {
            if (pollInterval) clearInterval(pollInterval);
            pollInterval = setInterval(() => {
                if (!ws || ws.readyState !== WebSocket.OPEN) {
                    loadLogs();
                }
            }, 2000);
        }
        
        document.getElementById('levelFilter').addEventListener('change', () => loadLogs());
        document.getElementById('fileFilter').addEventListener('input', () => loadLogs());
        document.getElementById('searchBox').addEventListener('input', () => loadLogs());
        
        connectWebSocket();
        startPolling();
        loadLogs();
    </script>
</body>
</html>
  ''';
}