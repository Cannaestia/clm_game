const teams = ["Red", "Blue", "Green", "Yellow", "Purple"];
const totalGoals = 10;
const scores = {};

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'updateGameState') {
        // Update the game state here
        updateGame(data.gameState);
    }
};


document.addEventListener("DOMContentLoaded", function () {
    const teamsContainer = document.getElementById("teams");

    teams.forEach(function (team, index) {
        scores[team] = 0;

        const teamDiv = document.createElement("div");
        teamDiv.className = "team mb-4";

        const teamName = document.createElement("h2");
        teamName.className = "mb-3";
        teamName.style.color = team.toLowerCase();
        teamName.textContent = team;

        const lineDiv = document.createElement("div");
        lineDiv.className = "line";

        for (let i = 0; i < totalGoals; i++) {
            const goalDiv = document.createElement("div");
            goalDiv.className = "goal";
            goalDiv.dataset.team = index;
            goalDiv.dataset.goal = i;

            lineDiv.appendChild(goalDiv);
        }

        teamDiv.appendChild(teamName);
        teamDiv.appendChild(lineDiv);

        if (window.location.pathname.includes("index.html")) {
            const btnGroup = document.createElement("div");
            btnGroup.className = "btn-group";

            const completeBtn = document.createElement("button");
            completeBtn.className = "btn btn-primary";
            completeBtn.textContent = "Complete Goal";
            completeBtn.dataset.team = index;
            completeBtn.onclick = function () {
                completeGoal(index);
            };

            btnGroup.appendChild(completeBtn);

            teamDiv.appendChild(btnGroup);
        }

        teamsContainer.appendChild(teamDiv);
    });

    updateGame();
});

function completeGoal(teamIndex) {
    ws.send(JSON.stringify({ type: 'completeGoal', teamIndex: parseInt(teamIndex) }));
}

function updateGame(gameState) {
    gameState.teamGoals.forEach((goals, index) => {
        const teamGoals = document.querySelectorAll(`.team[data-id="${index}"] .goal`);
        teamGoals.forEach((goal, i) => {
            if (i < goals) {
                goal.style.backgroundColor = teams[index].toLowerCase();
                goal.style.opacity = 1;
            } else {
                goal.style.opacity = 0;
            }
        });
    });
}


// function updateGame(gameState) {
//     const teamGoals = gameState.teamGoals;

//     teams.forEach(function (team, index) {
//         const goals = document.querySelectorAll(`.team:nth-child(${parseInt(index) + 1}) .goal`);
//         const completedGoals = teamGoals[index] || 0;

//         goals.forEach(function (goal, goalIndex) {
//             if (goalIndex < completedGoals) {
//                 goal.style.backgroundColor = teams[index].toLowerCase();
//                 goal.style.opacity = 1;
//             } else {
//                 goal.style.opacity = 0;
//             }
//         });

//         if (completedGoals >= totalGoals) {
//             scores[team] += 1;
//             alert(team + " has won this round!");
//             resetRound();
//         }
//     });

//     updateScoreboard();
// }

function updateScoreboard() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = '';

    for (const [team, score] of Object.entries(scores)) {
        const teamScore = document.createElement("div");
        teamScore.className = "col";
        teamScore.textContent = team + ": " + score;

        scoreboard.appendChild(teamScore);
    }
}

function resetRound() {
    const goals = document.querySelectorAll(`.goal`);
    goals.forEach(function (goal) {
        goal.style.opacity = 0;
    });
}

