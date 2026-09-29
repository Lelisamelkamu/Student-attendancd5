// ==========================================
// STUDENT ATTENDANCE MANAGEMENT SYSTEM
// ==========================================


// ==========================================
// LOAD SAVED DATA
// ==========================================

let students =
    JSON.parse(localStorage.getItem("attendanceData")) || [];

let editIndex = -1;


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(students)
    );

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderTable() {

    const tbody =
        document.getElementById("tableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const searchInput =
        document.getElementById("search");

    const search =
        searchInput.value.trim().toLowerCase();

    tbody.innerHTML = "";


    const filteredStudents =
        students.filter(student =>

            student.id.toLowerCase().includes(search) ||

            student.name.toLowerCase().includes(search)

        );


    // No students found

    if (filteredStudents.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create table rows

    filteredStudents.forEach(student => {

        const realIndex =
            students.indexOf(student);

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.id}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.date || "-"}
            </td>

            <td class="${
                student.status === "Present"
                    ? "status-present"
                    : student.status === "Absent"
                    ? "status-absent"
                    : ""
            }">

                ${student.status || "Not Marked"}

            </td>

            <td>

                <button
                    class="btn-edit"
                    onclick="editStudent(${realIndex})"
                >
                    ✏ Edit
                </button>

                <button
                    class="btn-delete"
                    onclick="deleteStudent(${realIndex})"
                >
                    🗑 Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });


    updateStatistics();

}


// ==========================================
// ADD STUDENT
// ==========================================

function addStudent() {

    const id =
        document
        .getElementById("studentId")
        .value
        .trim();

    const name =
        document
        .getElementById("studentName")
        .value
        .trim();


    // Check empty fields

    if (!id || !name) {

        alert(
            "Please enter Student ID and Student Name!"
        );

        return;

    }


    // EDIT MODE

    if (editIndex !== -1) {

        const oldId =
            students[editIndex].id;


        // Check duplicate ID

        const duplicate =
            students.some(
                (student, index) =>
                    student.id.toLowerCase() === id.toLowerCase()
                    && index !== editIndex
            );


        if (duplicate) {

            alert(
                "This Student ID already exists!"
            );

            return;

        }


        students[editIndex].id = id;

        students[editIndex].name = name;


        saveData();

        renderTable();

        clearFields();


        alert(
            "Student information updated successfully! ✅"
        );

        return;

    }


    // ADD NEW STUDENT

    const exists =
        students.some(
            student =>
                student.id.toLowerCase() ===
                id.toLowerCase()
        );


    if (exists) {

        alert(
            "This Student ID already exists!"
        );

        return;

    }


    const newStudent = {

        id: id,

        name: name,

        date: "",

        status: ""

    };


    students.push(newStudent);


    saveData();

    renderTable();

    clearFields();


    alert(
        "Student added successfully! 🎉"
    );

}


// ==========================================
// MARK ATTENDANCE
// ==========================================

function markAttendance() {

    const id =
        document
        .getElementById("studentId")
        .value
        .trim();

    const status =
        document
        .getElementById("status")
        .value;


    if (!id) {

        alert(
            "Please enter Student ID!"
        );

        return;

    }


    const student =
        students.find(
            student =>
                student.id.toLowerCase() ===
                id.toLowerCase()
        );


    if (!student) {

        alert(
            "Student ID not found!"
        );

        return;

    }


    // Get today's date

    const today =
        new Date().toLocaleDateString();


    student.date = today;

    student.status = status;


    saveData();

    renderTable();


    alert(
        "Attendance marked as " +
        status +
        " successfully! ✅"
    );

}


// ==========================================
// EDIT STUDENT
// ==========================================

function editStudent(index) {

    const student =
        students[index];


    document
        .getElementById("studentId")
        .value = student.id;


    document
        .getElementById("studentName")
        .value = student.name;


    document
        .getElementById("status")
        .value =
        student.status || "Present";


    editIndex = index;


    alert(
        "Student information loaded. " +
        "Edit the information and click Add Student."
    );

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(index) {

    const student =
        students[index];


    const confirmation =
        confirm(
            "Delete " +
            student.name +
            " from the system?"
        );


    if (!confirmation) {

        return;

    }


    students.splice(index, 1);


    saveData();

    renderTable();

    clearFields();


    alert(
        "Student deleted successfully."
    );

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearFields() {

    document
        .getElementById("studentId")
        .value = "";


    document
        .getElementById("studentName")
        .value = "";


    document
        .getElementById("status")
        .value = "Present";


    editIndex = -1;

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        students.length;


    const present =
        students.filter(
            student =>
                student.status === "Present"
        ).length;


    const absent =
        students.filter(
            student =>
                student.status === "Absent"
        ).length;


    const marked =
        present + absent;


    let percentage = 0;


    if (marked > 0) {

        percentage =
            Math.round(
                (present / marked) * 100
            );

    }


    document
        .getElementById("totalStudents")
        .textContent = total;


    document
        .getElementById("presentCount")
        .textContent = present;


    document
        .getElementById("absentCount")
        .textContent = absent;


    document
        .getElementById("attendancePercent")
        .textContent =
        percentage + "%";

}


// ==========================================
// DARK MODE
// ==========================================

function toggleDarkMode() {

    document
        .body
        .classList
        .toggle("dark");


    const darkMode =
        document
        .body
        .classList
        .contains("dark");


    localStorage.setItem(
        "darkMode",
        darkMode
    );

}


// Load saved Dark Mode

if (
    localStorage.getItem("darkMode") === "true"
) {

    document
        .body
        .classList
        .add("dark");

}


// ==========================================
// EXPORT CSV
// ==========================================

function exportCSV() {

    if (students.length === 0) {

        alert(
            "There is no student data to export!"
        );

        return;

    }


    let csv =
        "Student ID,Name,Date,Status\n";


    students.forEach(student => {

        csv +=
            `"${student.id}","${student.name}","${student.date}","${student.status}"\n`;

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "student-attendance.csv";


    document
        .body
        .appendChild(link);


    link.click();


    document
        .body
        .removeChild(link);


    URL.revokeObjectURL(url);

}


// ==========================================
// START APPLICATION
// ==========================================

renderTable();
