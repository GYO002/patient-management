document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('patient-form');
    const patientList = document.getElementById('patientList');
    const symptomButtons = document.querySelectorAll('.symptom-toggle');

    loadPatients();

    // Toggle symptom selection
    symptomButtons.forEach(button => {
        button.addEventListener('click', function () {
            button.classList.toggle('active');
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const conditions = document.getElementById('condition').value.split(',').map(cond => cond.trim());

        // 選択された症状を取得
        const symptoms = Array.from(symptomButtons)
            .filter(button => button.classList.contains('active'))
            .map(button => button.getAttribute('data-symptom'));

        const severity = assessSeverity(symptoms);
        const tested = document.getElementById('tested').value;

        const patient = { name, age, conditions, symptoms, severity, tested };
        savePatient(patient);
        addPatientToList(patient);
        form.reset();
        clearSymptomSelection(); // 選択状態をクリア
    });

    function clearSymptomSelection() {
        symptomButtons.forEach(button => button.classList.remove('active'));
    }

    function addPatientToList(patient) {
        const patientItem = document.createElement('li');
        patientItem.textContent = `名前: ${patient.name}, 年齢: ${patient.age}, 重症度: ${patient.severity}`;

        if (patient.severity === '重症') {
            patientItem.style.color = 'red';
        }

        patientList.appendChild(patientItem);
    }

    function savePatient(patient) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.push(patient);
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    function loadPatients() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.forEach(addPatientToList);
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
});