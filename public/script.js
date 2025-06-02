document.getElementById('readMoreBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const caseInfo = document.getElementById('caseInfo');

    caseInfo.style.display = 'block';

    document.getElementById('close').addEventListener('click', () => {
        caseInfo.style.display = 'none'
    })
})