document.getElementById('startBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const lesson = document.getElementById('lessonSelect').value;

    if (!username) {
        alert('Please enter your name.');
        return;
    }

    localStorage.setItem('username', username);

    if (lesson === 'replication') {
        window.location.href = 'shop.html';
    } else {
        alert('This lesson is not yet available.');
    }
});
