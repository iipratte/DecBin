let bitCount, currentDecimal, correctAnswers, startTime, timerInterval;
let gameActive = false;

function resetToMenu() {
    clearInterval(timerInterval);
    gameActive = false;
    document.getElementById('mode-select').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('timer').style.display = 'block';
    correctAnswers = 0;
}

function startGame(bits) {
    bitCount = bits;
    correctAnswers = 0;
    gameActive = true;
    document.getElementById('mode-select').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('status').textContent = '';
    document.getElementById('question-count').textContent = `Correct: 0 / 10`;
    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('timer').style.display = 'block';
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 100);
    nextQuestion();
}

function updateTimer() {
    const elapsed = ((new Date() - startTime) / 1000).toFixed(1);
    document.getElementById('timer').textContent = `Time: ${elapsed}s`;
}

function nextQuestion() {
    currentDecimal = Math.floor(Math.random() * (2 ** bitCount));
    document.getElementById('question').textContent = `Convert ${currentDecimal} to binary:`;
    const inputDiv = document.getElementById('binary-input');
    inputDiv.innerHTML = '';
    
    for (let i = 0; i < bitCount; i++) {
        const input = document.createElement('input');
        input.type = 'tel';
        input.maxLength = 1;
        input.className = 'bit-box';
        input.oninput = function() {
            if (this.value === '0' || this.value === '1') {
                const next = this.nextElementSibling;
                if (next) next.focus();
                // Auto-submit when all boxes are filled
                checkAndAutoSubmit();
            } else {
                this.value = '';
            }
        };
        input.onkeydown = function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                const prev = this.previousElementSibling;
                if (prev) prev.focus();
            }
        };
        inputDiv.appendChild(input);
    }
    inputDiv.firstChild.focus();
}

function checkAndAutoSubmit() {
    const bits = Array.from(document.querySelectorAll('.bit-box')).map(b => b.value);
    // Check if all boxes are filled
    if (bits.every(v => v === '0' || v === '1')) {
        // Small delay to allow the last input to be visible before checking
        setTimeout(submitAnswer, 100);
    }
}

function submitAnswer() {
    const bits = Array.from(document.querySelectorAll('.bit-box')).map(b => b.value);
    if (bits.some(v => v !== '0' && v !== '1')) {
        document.getElementById('status').textContent = 'Fill all boxes with 0 or 1!';
        return;
    }
    
    const userBinary = bits.join('');
    const userValue = parseInt(userBinary, 2);
    
    if (userValue === currentDecimal) {
        correctAnswers++;
        document.getElementById('status').textContent = '✅ Correct!';
        document.getElementById('question-count').textContent = `Correct: ${correctAnswers} / 10`;
        
        if (correctAnswers >= 10) {
            gameActive = false;
            clearInterval(timerInterval);
            const elapsed = ((new Date() - startTime) / 1000).toFixed(1);
            document.getElementById('question').textContent = '';
            document.getElementById('timer').style.display = 'none';
            document.getElementById('binary-input').innerHTML = '';
            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('reset-btn').style.display = 'inline-block';
            document.getElementById('status').textContent = `🎉 Perfect! You completed all 10 in ${elapsed}s`;
            
            // Prompt for name BEFORE saving score
            promptForName(`${bitCount}-bit`, parseFloat(elapsed));
            return;
        }
        
        nextQuestion();
    } else {
        document.getElementById('status').textContent = '❌ Try again!';
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && gameActive && document.getElementById('game').style.display === 'block' && document.getElementById('submit-btn').style.display !== 'none') {
        submitAnswer();
    }
});