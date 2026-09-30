// Load data from localStorage
let students = JSON.parse(localStorage.getItem("attendanceData")) || [];

function saveData() {
    localStorage.setItem("attendanceData", JSON.stringify(students));
    updateStats();
}

function updateStats() {
    const total = students.length;
    const present = students.filter(s => s.status === 'Present').length;
    const absent = students.filter(s => s.status === 'Absent').length;

    document.getElementById("statTotal").innerText = total;
    document.getElementById("statPresent").innerText = present;
    document.getElementById("statAbsent").innerText = absent;
}

function renderTable() {
    const tbody = document.getElementById("tableBody");
    const emptyMsg = document.getElementById("emptyMessage");
    const searchQuery = document.getElementById("searchBox").value.toLowerCase().trim();
    
    tbody.innerHTML = "";

    // Filter student list live according to matching characters
    const filteredStudents = students.filter(student => 
        student.id.toLowerCase().includes(searchQuery) || 
        student.name.toLowerCase().includes(searchQuery)
    );

    if (filteredStudents.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
    
    emptyMsg.style.display = "none";
    
    filteredStudents.forEach((student) => {
        // Find original storage index relative to parent array for clean deletion
        const originalIndex = students.findIndex(s => s.id === student.id);
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.date || "-"}</td>
            <td class="${student.status === 'Present' ? 'status-present' : student.status === 'Absent' ? 'status-absent' : ''}">
                ${student.status || "-"}
            </td>
            <td>
                <button class="btn-delete" onclick="deleteStudent(${originalIndex})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addStudent() {
    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    
    if (!id || !name) {
        alert("Student ID fi Name galchi!");
        return;
    }
    
    if (students.some(s => s.id === id)) {
        alert("Student ID kun duraan jira!");
        return;
    }

    students.push({ id: id, name: name, date: "", status: "" });
    saveData();
    renderTable();
    clearFields();
    alert("Student milkaa'inaan dabalamte!");
}

function markAttendance() {
    const id = document.getElementById("studentId").value.trim();
    const status = document.getElementById("status").value;

    if (!id) {
        alert("Student ID galchi!");
    }

    const student = students.find(s => s.id === id);
    if (!student) {
        alert("Student ID hin argamne!");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    student.date = today;
    student.status = status;
    
    saveData();
    renderTable();
    alert(`Attendance ${status} ta'ee mark godhame!`);
}

function deleteStudent(index) {
    if (confirm("Student kana delete gochuu barbaaddaa?")) {
        students.splice(index, 1);
        saveData();
        renderTable();
    }
}

function clearFields() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("status").value = "Present";
}

function exportToCSV() {
    if (students.length === 0) {
        alert("Data base irratti hin argamne bareessuuf!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student ID,Name,Date,Status\n";

    students.forEach(s => {
        let row = `"${s.id}","${s.name}","${s.date || '-'}","${s.status || '-'}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Attendance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Run initial data metrics on window setup
updateStats();
renderTable();
