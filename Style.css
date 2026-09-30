const STORAGE_KEY = "attendanceRecords";
let records = loadRecords();

function loadRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function today() {
    // Local date as YYYY-MM-DD
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, isError = false) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "toast" + (isError ? " error" : "");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function getFields() {
    return {
        id: document.getElementById("studentId").value.trim().toUpperCase(),
        name: document.getElementById("studentName").value.trim(),
        status: document.getElementById("status").value
    };
}

function findStudent(id) {
    return records.find(r => r.id === id);
}

function addStudent() {
    const { id, name, status } = getFields();
    if (!id || !name) {
        showToast("Enter both a student ID and a name.", true);
        return;
    }
    if (findStudent(id)) {
        showToast(`ID ${id} already exists. Use Mark Attendance instead.`, true);
        return;
    }
    records.push({ id, name, date: today(), status });
    saveRecords();
    clearFields();
    renderTable();
    showToast(`${name} added.`);
}

function markAttendance() {
    const { id, status } = getFields();
    if (!id) {
        showToast("Enter the student ID to mark.", true);
        return;
    }
    const student = findStudent(id);
    if (!student) {
        showToast(`No student with ID ${id}. Add the student first.`, true);
        return;
    }
    const date = today();
    const existing = records.find(r => r.id === id && r.date === date);
    if (existing) {
        existing.status = status;
    } else {
        records.push({ id, name: student.name, date, status });
    }
    saveRecords();
    clearFields();
    renderTable();
    showToast(`${student.name} marked ${status.toLowerCase()}.`);
}

function clearFields() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("status").value = "Present";
}

function deleteRecord(index) {
    const rec = records[index];
    if (!rec) return;
    if (!confirm(`Delete the ${rec.date} record for ${rec.name}?`)) return;
    records.splice(index, 1);
    saveRecords();
    renderTable();
}

function updateStats() {
    const date = today();
    const uniqueIds = new Set(records.map(r => r.id));
    const todays = records.filter(r => r.date === date);
    document.getElementById("statTotal").textContent = uniqueIds.size;
    document.getElementById("statPresent").textContent =
        todays.filter(r => r.status === "Present").length;
    document.getElementById("statAbsent").textContent =
        todays.filter(r => r.status === "Absent").length;
}

function renderTable() {
    const query = document.getElementById("searchBox").value.trim().toLowerCase();
    const body = document.getElementById("tableBody");
    body.innerHTML = "";

    let shown = 0;
    // Newest records first, but keep original index for deletion
    for (let i = records.length - 1; i >= 0; i--) {
        const r = records[i];
        if (query && !r.name.toLowerCase().includes(query) &&
            !r.id.toLowerCase().includes(query)) continue;
        shown++;
        const tr = document.createElement("tr");
        const cls = r.status === "Present" ? "present" : "absent";
        tr.innerHTML = `
            <td>${escapeHtml(r.id)}</td>
            <td>${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.date)}</td>
            <td><span class="badge ${cls}">${escapeHtml(r.status)}</span></td>
            <td><button class="btn-delete" onclick="deleteRecord(${i})">Delete</button></td>
        `;
        body.appendChild(tr);
    }

    const empty = document.getElementById("emptyMessage");
    empty.style.display = shown === 0 ? "block" : "none";
    empty.textContent = records.length === 0
        ? "No students yet. Add one above to get started."
        : "No records found matching your query.";

    updateStats();
}

function exportToCSV() {
    if (records.length === 0) {
        showToast("Nothing to export yet.", true);
        return;
    }
    const cell = v => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [["Student ID", "Name", "Date", "Status"]]
        .concat(records.map(r => [r.id, r.name, r.date, r.status]));
    const csv = rows.map(row => row.map(cell).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

renderTable();
