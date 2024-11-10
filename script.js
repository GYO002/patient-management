document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('patient-form');
    const patientList = document.getElementById('patientList');
    const symptomButtons = document.querySelectorAll('.symptom-toggle');

    loadPatients();

    // PDF出力ボタンのクリックイベント
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const temperature = document.getElementById('temperature').value || '未入力';
        const conditions = document.getElementById('condition').value.split(',').map(cond => cond.trim());

        // 選択された症状を取得
        const symptoms = Array.from(symptomButtons)
            .filter(button => button.classList.contains('active'))
            .map(button => button.getAttribute('data-symptom'));

        const severity = assessSeverity(symptoms);
        const tested = document.getElementById('tested').value;

        const patient = { name, age, temperature, conditions, symptoms, severity, tested };
        savePatient(patient);
        refreshPatientList();
        form.reset();
        clearSymptomSelection();
    });

    function clearSymptomSelection() {
        symptomButtons.forEach(button => button.classList.remove('active'));
    }

    // ボタンのイベントリスナー設定
    symptomButtons.forEach(button => {
        button.addEventListener('click', function () {
            button.classList.toggle('active'); // ボタンを押すとアクティブ状態が切り替わる
        });
    });

    function addPatientToList(patient, index) {
        const patientItem = document.createElement('li');
        patientItem.classList.add('patient-item');
        patientItem.textContent = `名前: ${patient.name}, 年齢: ${patient.age}, 体温: ${patient.temperature}℃, 重症度: ${patient.severity}`;

        if (patient.severity === '重症') {
            patientItem.style.color = 'red';
        }

        patientItem.addEventListener('click', (event) => {
            if (event.target !== deleteButton) {
                const queryParams = new URLSearchParams({
                    name: patient.name,
                    age: patient.age,
                    temperature: patient.temperature,
                    conditions: patient.conditions.join(','),
                    symptoms: patient.symptoms.join(','),
                    severity: patient.severity,
                    tested: patient.tested
                });
                window.location.href = `detail.html?${queryParams.toString()}`;
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            deletePatient(index);
        });

        patientItem.appendChild(deleteButton);
        patientList.appendChild(patientItem);
    }

    function deletePatient(index) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.splice(index, 1);
        localStorage.setItem('patients', JSON.stringify(patients));
        refreshPatientList();
    }

    function savePatient(patient) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.push(patient);
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    function loadPatients() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.forEach((patient, index) => addPatientToList(patient, index));
    }

    function refreshPatientList() {
        patientList.innerHTML = '';
        loadPatients();
    }

    function assessSeverity(symptoms) {
        if (symptoms.includes('difficulty_breathing') || symptoms.includes('chest_pain')) {
            return '重症';
        } else if (symptoms.includes('fever') && symptoms.includes('cough')) {
            return '中等症';
        } else {
            return '軽症';
        }
    }

    // PDF出力用の関数
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('登録された患者一覧', 10, 10);
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        patients.forEach((patient, index) => {
            const patientInfo = `名前: ${patient.name}, 年齢: ${patient.age}, 体温: ${patient.temperature}℃, 重症度: ${patient.severity}`;
            doc.text(patientInfo, 10, 20 + (index * 10));
        });

        doc.save('患者一覧.pdf');
    }
});