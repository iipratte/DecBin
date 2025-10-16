let pendingScore = null;

function saveScore(mode, name, time) {
    const data = JSON.parse(localStorage.getItem("leaderboard") || "{}");
    if (!data[mode]) data[mode] = [];

    data[mode].push({ name, time });
    data[mode].sort((a, b) => a.time - b.time);
    data[mode] = data[mode].slice(0, 4);

    localStorage.setItem("leaderboard", JSON.stringify(data));
}

function promptForName(mode, time) {
    pendingScore = { mode, time };
    // Small delay to prevent Enter key from game submission triggering modal submission
    setTimeout(() => {
        document.getElementById("name-modal").style.display = "flex";
        document.getElementById("player-name").focus();
    }, 100);
}

function submitName() {
    const input = document.getElementById("player-name");
    const name = input.value.trim() || "Anonymous";
    if (pendingScore) {
        saveScore(pendingScore.mode, name, pendingScore.time);
        pendingScore = null;
    }
    input.value = "";
    document.getElementById("name-modal").style.display = "none";
    showLeaderboard();
}

function showLeaderboard() {
    const data = JSON.parse(localStorage.getItem("leaderboard") || "{}");
    const listDiv = document.getElementById("leaderboard-list");
    listDiv.innerHTML = "";

    if (Object.keys(data).length === 0) {
        listDiv.innerHTML = "<p class='no-scores'>No scores yet. Play a game!</p>";
        document.getElementById("leaderboard-modal").style.display = "flex";
        return;
    }

    const modes = ["4-bit", "8-bit"];
    const modeNames = { "4-bit": "Nibble (4-bit)", "8-bit": "Byte (8-bit)" };

    const grid = document.createElement("div");
    grid.className = "leaderboard-grid";

    modes.forEach(mode => {
        const section = document.createElement("div");
        section.className = "leaderboard-section";
        
        const title = document.createElement("h3");
        title.textContent = modeNames[mode];
        section.appendChild(title);

        if (data[mode] && data[mode].length > 0) {
            const ol = document.createElement("ol");
            data[mode].forEach(entry => {
                // Validate entry has required properties
                if (entry && entry.name && typeof entry.time === 'number') {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span class="player-name">${entry.name}</span>
                        <span class="player-time">${entry.time.toFixed(2)}s</span>
                    `;
                    ol.appendChild(li);
                }
            });
            section.appendChild(ol);
        } else {
            const empty = document.createElement("p");
            empty.className = "no-scores";
            empty.textContent = "No scores yet";
            section.appendChild(empty);
        }

        grid.appendChild(section);
    });

    listDiv.appendChild(grid);
    document.getElementById("leaderboard-modal").style.display = "flex";
}

function closeLeaderboard() {
    document.getElementById("leaderboard-modal").style.display = "none";
}

let enterKeyEnabled = false;

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const nameModal = document.getElementById('name-modal');
        const nameModalVisible = nameModal.style.display === 'flex';
        
        // Only submit if modal is visible AND input is focused
        if (nameModalVisible && document.activeElement.id === 'player-name') {
            submitName();
        }
    }
    if (event.key === 'Escape') {
        if (document.getElementById('leaderboard-modal').style.display === 'flex') {
            closeLeaderboard();
        }
    }
});