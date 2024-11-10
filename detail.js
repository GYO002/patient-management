document.addEventListener('DOMContentLoaded', function () {
    // 症状の英語コードと日本語のマッピング
    const symptomTranslations = {
        fever: "発熱",
        cough: "咳",
        difficulty_breathing: "呼吸困難",
        fatigue: "倦怠感",
        chest_pain: "胸痛"
    };

    // URLパラメータから患者データを取得
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const age = urlParams.get('age');
    const conditions = urlParams.get('conditions').split(',');
    const symptoms = urlParams.get('symptoms').split(',').map(symptom => symptomTranslations[symptom] || symptom);
    const severity = urlParams.get('severity');
    const tested = urlParams.get('tested');

    // 画面にデータを表示
    document.getElementById('detail-name').textContent = name;
    document.getElementById('detail-age').textContent = age;
    document.getElementById('detail-conditions').textContent = conditions.join(', ');
    document.getElementById('detail-symptoms').textContent = symptoms.join(', ');
    document.getElementById('detail-severity').textContent = severity;
    document.getElementById('detail-tested').textContent = tested === 'not_tested' ? '未検査' : (tested === 'tested_positive' ? '陽性' : '陰性');

    // 経過観察データの取得・表示
    const observationList = document.getElementById('observation-list');
    const observations = JSON.parse(localStorage.getItem(`observations_${name}`)) || [];

    function displayObservations() {
        observationList.innerHTML = '';
        observations.forEach(obs => {
            const obsItem = document.createElement('li');
            obsItem.textContent = `${obs.date} - 体温: ${obs.temperature}℃, 症状: ${obs.symptom}`;
            observationList.appendChild(obsItem);
        });
    }

    displayObservations();

    // 経過観察の記録を追加
    document.getElementById('add-observation').addEventListener('click', function () {
        const date = document.getElementById('observation-date').value;
        const temperature = document.getElementById('observation-temperature').value;
        const symptom = document.getElementById('observation-symptom').value;

        if (date && temperature && symptom) {
            const newObservation = { date, temperature, symptom };
            observations.push(newObservation);
            localStorage.setItem(`observations_${name}`, JSON.stringify(observations));
            displayObservations();
            document.getElementById('observation-date').value = '';
            document.getElementById('observation-temperature').value = '';
            document.getElementById('observation-symptom').value = '';
        } else {
            alert("全てのフィールドを入力してください。");
        }
    });

    // 戻るボタンの動作を追加
    document.getElementById('back-button').addEventListener('click', goBack);

    function goBack() {
        window.history.back();
    }
});